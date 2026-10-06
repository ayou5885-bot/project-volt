import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { formatDZD } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Volt Store" },
      { name: "description", content: "Review your items before checkout." },
      { property: "og:title", content: "Your cart — Volt Store" },
      { property: "og:description", content: "Review your items before cash-on-delivery checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const { t, lang } = useI18n();
  return (
    <StoreLayout>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">{t("cart")}</h1>
        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">{t("emptyCart")}</p>
            <Link to="/shop" className="mt-4 inline-block font-medium text-primary">{t("shopNow")}</Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-4 p-4">
                  <img src={i.image} alt="" className="size-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <Link to="/product/$slug" params={{ slug: i.slug }} className="font-medium hover:text-primary">{i.name}</Link>
                    <p className="text-sm text-muted-foreground">{formatDZD(i.price, lang)}</p>
                  </div>
                  <input type="number" min={1} aria-label={`${t("qty")}: ${i.name}`} value={i.qty} onChange={(e) => setQty(i.id, Number(e.target.value))} className="h-9 w-16 rounded-md border border-input bg-background px-2" />
                  <button onClick={() => remove(i.id)} aria-label={`${t("remove")}: ${i.name}`} className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive"><Trash2 className="size-4" aria-hidden /></button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-lg">{t("subtotal")}: <span className="font-display font-bold">{formatDZD(subtotal, lang)}</span></p>
              <Link to="/checkout" className="inline-flex h-11 items-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-glow">{t("checkout")}</Link>
            </div>
          </>
        )}
      </div>
    </StoreLayout>
  );
}
