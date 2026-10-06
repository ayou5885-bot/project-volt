import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
type Theme = "dark" | "light";

const dict = {
  home: { en: "Home", ar: "الرئيسية" },
  shop: { en: "Shop", ar: "المتجر" },
  cart: { en: "Cart", ar: "السلة" },
  track: { en: "Track order", ar: "تتبع الطلب" },
  checkout: { en: "Checkout", ar: "إتمام الطلب" },
  shopNow: { en: "Shop now", ar: "تسوق الآن" },
  newArrivals: { en: "New arrivals", ar: "وصل حديثاً" },
  featured: { en: "Featured", ar: "مميز" },
  categories: { en: "Categories", ar: "الفئات" },
  brands: { en: "Brands", ar: "العلامات" },
  allCategories: { en: "All categories", ar: "كل الفئات" },
  allBrands: { en: "All brands", ar: "كل العلامات" },
  search: { en: "Search products…", ar: "ابحث عن منتج…" },
  minPrice: { en: "Min price", ar: "أدنى سعر" },
  maxPrice: { en: "Max price", ar: "أعلى سعر" },
  availability: { en: "Availability", ar: "التوفر" },
  any: { en: "Any", ar: "الكل" },
  inStock: { en: "In stock", ar: "متوفر" },
  outOfStock: { en: "Out of stock", ar: "غير متوفر" },
  preorder: { en: "Pre-order", ar: "طلب مسبق" },
  addToCart: { en: "Add to cart", ar: "أضف إلى السلة" },
  added: { en: "Added to cart", ar: "أضيف إلى السلة" },
  noProducts: { en: "No products yet.", ar: "لا توجد منتجات بعد." },
  specs: { en: "Specifications", ar: "المواصفات" },
  features: { en: "Features", ar: "المميزات" },
  emptyCart: { en: "Your cart is empty.", ar: "سلتك فارغة." },
  subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
  shipping: { en: "Shipping", ar: "الشحن" },
  discount: { en: "Discount", ar: "الخصم" },
  total: { en: "Total", ar: "الإجمالي" },
  remove: { en: "Remove", ar: "إزالة" },
  fullName: { en: "Full name", ar: "الاسم الكامل" },
  phone: { en: "Phone", ar: "الهاتف" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  wilaya: { en: "Wilaya", ar: "الولاية" },
  chooseWilaya: { en: "Choose your wilaya", ar: "اختر ولايتك" },
  address: { en: "Address", ar: "العنوان" },
  notes: { en: "Notes (optional)", ar: "ملاحظات (اختياري)" },
  coupon: { en: "Coupon code", ar: "رمز القسيمة" },
  apply: { en: "Apply", ar: "تطبيق" },
  cod: { en: "Cash on delivery", ar: "الدفع عند الاستلام" },
  placeOrder: { en: "Place order", ar: "تأكيد الطلب" },
  orderPlaced: { en: "Order placed!", ar: "تم تأكيد طلبك!" },
  trackHint: { en: "Save this link to follow your order:", ar: "احفظ هذا الرابط لتتبع طلبك:" },
  token: { en: "Tracking code", ar: "رمز التتبع" },
  find: { en: "Find order", ar: "ابحث عن الطلب" },
  notFound: { en: "No order found.", ar: "لم يتم العثور على الطلب." },
  status: { en: "Status", ar: "الحالة" },
  pending: { en: "Pending", ar: "قيد الانتظار" },
  confirmed: { en: "Confirmed", ar: "مؤكد" },
  shipped: { en: "Shipped", ar: "تم الشحن" },
  delivered: { en: "Delivered", ar: "تم التسليم" },
  cancelled: { en: "Cancelled", ar: "ملغى" },
  contact: { en: "Contact", ar: "تواصل معنا" },
  followUs: { en: "Follow us", ar: "تابعنا" },
  rights: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  toggleTheme: { en: "Toggle light/dark mode", ar: "تبديل الوضع الفاتح/الداكن" },
  switchLang: { en: "العربية", ar: "English" },
  viewAll: { en: "View all", ar: "عرض الكل" },
  qty: { en: "Qty", ar: "الكمية" },
  items: { en: "Items", ar: "المنتجات" },
} as const;

export type DictKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; theme: Theme; toggleTheme: () => void; t: (k: DictKey) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const l = localStorage.getItem("lang") as Lang | null;
    const th = localStorage.getItem("theme") as Theme | null;
    if (l) setLangState(l);
    if (th) setTheme(th);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("lang", l); };
  const toggleTheme = () => setTheme((p) => { const n = p === "dark" ? "light" : "dark"; localStorage.setItem("theme", n); return n; });
  const t = (k: DictKey) => dict[k][lang];
  return <I18nCtx.Provider value={{ lang, setLang, theme, toggleTheme, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
