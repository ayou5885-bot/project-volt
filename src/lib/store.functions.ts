import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* eslint-disable @typescript-eslint/no-explicit-any */
function anonClient(): any {
  return createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

const orderInput = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_phone: z.string().trim().min(8).max(20),
  customer_email: z.string().trim().email().max(200),
  wilaya_code: z.string().min(1).max(3),
  address: z.string().trim().min(4).max(400),
  notes: z.string().max(1000).optional(),
  coupon_code: z.string().max(50).optional(),
  items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(99) })).min(1).max(50),
});

// Prices, shipping and discount are recomputed here so the browser can't tamper with them.
// Inserts as the public visitor role (matches the "public insert orders" rule); stock is NOT touched.
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => orderInput.parse(d))
  .handler(async ({ data }) => {
    const db = anonClient();
    const ids = data.items.map((i) => i.id);
    const { data: products, error: pe } = await db.from("products").select("id,name,price,image").in("id", ids);
    if (pe) throw new Error(pe.message);
    const items = data.items.map((i) => {
      const p = products.find((x: any) => x.id === i.id);
      if (!p) throw new Error("Product not found");
      return { id: p.id, name: p.name, price: Number(p.price), qty: i.qty, image: p.image };
    });
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const { data: w, error: we } = await db.from("wilayas").select("*").eq("code", data.wilaya_code).single();
    if (we || !w) throw new Error("Invalid wilaya");
    let discount = 0;
    let coupon: string | null = null;
    if (data.coupon_code) {
      const { data: v } = await db.rpc("validate_coupon", { coupon_code: data.coupon_code, order_subtotal: subtotal });
      const r = v?.[0];
      if (!r?.valid) throw new Error(r?.message ?? "Invalid coupon");
      discount = r.discount_type === "percent" ? (subtotal * Number(r.discount_value)) / 100 : Number(r.discount_value);
      discount = Math.min(Math.round(discount), subtotal);
      coupon = data.coupon_code;
    }
    const shipping = Number(w.shipping_price);
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    const tracking_token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const { error } = await db.from("orders").insert({
      customer_name: data.customer_name, customer_phone: data.customer_phone, customer_email: data.customer_email,
      wilaya_code: w.code, wilaya_name: `${w.name_fr} - ${w.name_ar}`, address: data.address, notes: data.notes || null,
      items, subtotal, shipping, discount, coupon_code: coupon, total: subtotal + shipping - discount, tracking_token,
    });
    if (error) throw new Error(error.message);
    if (coupon) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: c } = await (supabaseAdmin as any).from("coupons").select("id,times_used").eq("code", coupon).single();
      if (c) await (supabaseAdmin as any).from("coupons").update({ times_used: c.times_used + 1 }).eq("id", c.id);
    }
    return { tracking_token, phone: data.customer_phone };
  });

// Staff/admin changes an order's status. Moving into "delivered" decrements stock for each item.
export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]) }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = context.supabase as any;
    const { data: isStaff } = await sb.rpc("is_staff");
    if (!isStaff) throw new Error("Forbidden");
    const { data: order, error } = await sb.from("orders").select("id,status,items").eq("id", data.id).single();
    if (error || !order) throw new Error("Order not found");
    const { error: ue } = await sb.from("orders").update({ status: data.status }).eq("id", data.id);
    if (ue) throw new Error(ue.message);
    if (data.status === "delivered" && order.status !== "delivered") {
      // Staff can't edit products under the rules, so the stock change runs with server privileges after the staff check above.
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const admin = supabaseAdmin as any;
      for (const it of order.items as { id: string; qty: number }[]) {
        const { data: p } = await admin.from("products").select("stock_quantity").eq("id", it.id).single();
        if (p) await admin.from("products").update({ stock_quantity: Math.max(0, p.stock_quantity - it.qty) }).eq("id", it.id);
      }
    }
    return { ok: true };
  });

// Admin invites a new team member by email and gives them a staff row.
export const inviteStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ email: z.string().email(), role: z.enum(["admin", "staff"]), redirectTo: z.string().url() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await (context.supabase as any).rpc("is_admin");
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: inv, error } = await admin.auth.admin.inviteUserByEmail(data.email, { redirectTo: data.redirectTo });
    if (error) throw new Error(error.message);
    const { error: se } = await admin.from("staff").upsert({ id: inv.user.id, email: data.email, role: data.role });
    if (se) throw new Error(se.message);
    return { ok: true };
  });
