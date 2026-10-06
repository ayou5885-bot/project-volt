import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { formatDZD } from "@/lib/format";
import { useWilayas } from "@/hooks/useWilayas";
import { supabase } from "@/integrations/supabase/client";
import { placeOrder } from "@/lib/store.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Volt Store" },
      { name: "description", content: "Cash on delivery checkout with shipping to every wilaya." },
      { property: "og:title", content: "Checkout — Volt Store" },
      { property: "og:description", content: "Pay cash on delivery anywhere in Algeria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { t, lang } = useI18n();
  const { data: wilayas = [] } = useWilayas();
  const submit = useServerFn(placeOrder);
  const [f, setF] = useState({ name: "", phone: "", email: "", wilaya: "", address: "", notes: "" });
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; type: string; value: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ token: string; phone: string } | null>(null);

  const w = wilayas.find((x) => x.code === f.wilaya);
  const shipping = w ? Number(w.shipping_price) : 0;
  const discount = applied ? Math.min(subtotal, Math.round(applied.type === "percent" ? (subtotal * applied.value) / 100 : applied.value)) : 0;
  const total = subtotal + shipping - discount;

  async function applyCoupon() {
    if (!coupon.trim()) return;
    const { data, error } = await supabase.rpc("validate_coupon" as never, { coupon_code: coupon.trim(), order_subtotal: subtotal } as never);
    const r = (data as unknown as { valid: boolean; discount_type: string; discount_value: number; message: string }[] | null)?.[0];
    if (error || !r?.valid) { setApplied(null); toast.error(r?.message ?? "Invalid coupon code"); return; }
    setApplied({ code: coupon.trim(), type: r.discount_type, value: Number(r.discount_value) });
    toast.success("OK");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await submit({ data: {
        customer_name: f.name, customer_phone: f.phone, customer_email: f.email, wilaya_code: f.wilaya,
        address: f.address, notes: f.notes || undefined, coupon_code: applied?.code,
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
      } });
      setDone({ token: r.tracking_token, phone: r.phone });
      clear();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally { setBusy(false); }
  }

  if (done) {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/track?phone=${encodeURIComponent(done.phone)}&token=${done.token}`;
    return (
      <StoreLayout>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto size-14 text-primary" aria-hidden />
          <h1 className="mt-4 text-3xl font-bold">{t("orderPlaced")}</h1>
          <p className="mt-4 text-muted-foreground">{t("trackHint")}</p>
          <a href={link} className="mt-3 block break-all rounded-lg border border-border bg-card p-4 font-mono text-sm text-primary" dir="ltr">{link}</a>
          <p className="mt-4 text-sm">{t("token")}: <span className="font-mono font-bold">{done.token}</span></p>
        </div>
      </StoreLayout>
    );
  }

  const field = "h-11 w-full rounded-md border border-input bg-background px-3";
  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">{t("checkout")}</h1>
        {items.length === 0 ? (
          <p className="mt-8 text-muted-foreground">{t("emptyCart")} <Link to="/shop" className="text-primary">{t("shopNow")}</Link></p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid gap-8 md:grid-cols-[1fr_380px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">{t("fullName")}<input required className={field} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
              <label className="space-y-1.5 text-sm">{t("phone")}<input required type="tel" dir="ltr" className={field} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              <label className="space-y-1.5 text-sm sm:col-span-2">{t("email")}<input required type="email" className={field} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
              <label className="space-y-1.5 text-sm sm:col-span-2">{t("wilaya")}
                <select required className={field} value={f.wilaya} onChange={(e) => setF({ ...f, wilaya: e.target.value })}>
                  <option value="">{t("chooseWilaya")}</option>
                  {wilayas.map((x) => <option key={x.code} value={x.code}>{x.code} - {lang === "ar" ? x.name_ar : x.name_fr} ({formatDZD(x.shipping_price, lang)})</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-sm sm:col-span-2">{t("address")}<input required className={field} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></label>
              <label className="space-y-1.5 text-sm sm:col-span-2">{t("notes")}<textarea className="min-h-24 w-full rounded-md border border-input bg-background p-3" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
            </div>
            <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
              <ul className="space-y-2 text-sm">{items.map((i) => <li key={i.id} className="flex justify-between gap-2"><span>{i.qty} × {i.name}</span><span>{formatDZD(i.qty * i.price, lang)}</span></li>)}</ul>
              <div className="flex gap-2">
                <input aria-label={t("coupon")} placeholder={t("coupon")} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <button type="button" onClick={applyCoupon} className="h-10 rounded-md border border-border px-4 text-sm font-medium hover:bg-secondary">{t("apply")}</button>
              </div>
              <dl className="space-y-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><dt>{t("subtotal")}</dt><dd>{formatDZD(subtotal, lang)}</dd></div>
                <div className="flex justify-between"><dt>{t("shipping")}</dt><dd>{formatDZD(shipping, lang)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-primary"><dt>{t("discount")}</dt><dd>-{formatDZD(discount, lang)}</dd></div>}
                <div className="flex justify-between pt-2 font-display text-lg font-bold"><dt>{t("total")}</dt><dd>{formatDZD(total, lang)}</dd></div>
              </dl>
              <p className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">{t("cod")}</p>
              <button disabled={busy} className="h-12 w-full rounded-lg bg-primary font-semibold text-primary-foreground shadow-glow disabled:opacity-50">{busy ? "…" : t("placeOrder")}</button>
            </aside>
          </form>
        )}
      </div>
    </StoreLayout>
  );
}
