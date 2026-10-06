import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { id: string; slug: string; name: string; price: number; image: string; qty: number };
type Ctx = {
  items: CartItem[];
  add: (i: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("cart", JSON.stringify(items)); }, [items, ready]);

  const add: Ctx["add"] = (i, qty = 1) =>
    setItems((p) => {
      const ex = p.find((x) => x.id === i.id);
      return ex ? p.map((x) => (x.id === i.id ? { ...x, qty: x.qty + qty } : x)) : [...p, { ...i, qty }];
    });
  const setQty = (id: string, qty: number) => setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));
  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const subtotal = items.reduce((s, x) => s + x.qty * x.price, 0);
  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
