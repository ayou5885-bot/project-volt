export type Category = { id: string; name: string; slug: string; description: string | null; image: string | null; created_at?: string };
export type Brand = { id: string; name: string; created_at?: string };
export type Spec = { label: string; value: string };
export type Product = {
  id: string; brand: string; name: string; slug: string; category: string; price: number; image: string;
  short_description: string | null; description: string | null; specifications: Spec[]; features: string[];
  availability: string; featured: boolean; stock_quantity: number; low_stock_threshold: number; created_at?: string;
};
export type Wilaya = { code: string; name_ar: string; name_fr: string; shipping_price: number };
export type Coupon = {
  id: string; code: string; discount_type: "percent" | "fixed"; discount_value: number; expires_at: string | null;
  active: boolean; usage_limit: number | null; times_used: number; created_at?: string;
};
export type OrderItem = { id: string; name: string; price: number; qty: number; image?: string };
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type Order = {
  id: string; created_at: string; customer_name: string; customer_phone: string; customer_email: string;
  wilaya_code: string; wilaya_name: string; address: string; notes: string | null; items: OrderItem[];
  subtotal: number; shipping: number; discount: number; coupon_code: string | null; total: number;
  status: OrderStatus; tracking_token: string;
};
export type Block = { type: "heading" | "text" | "image" | "cta"; value: string; link?: string };
export type LandingPage = {
  slug: string; title: string; hero_image: string | null; content_blocks: Block[]; active: boolean;
  starts_at: string | null; ends_at: string | null; created_at?: string;
};
export type StaffMember = { id: string; email: string; display_name: string | null; role: "admin" | "staff"; created_at?: string };
export const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
