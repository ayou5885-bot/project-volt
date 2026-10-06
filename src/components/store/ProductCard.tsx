import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { formatDZD } from "@/lib/format";

export function ProductCard({ p }: { p: Product }) {
  const { t, lang } = useI18n();
  const { add } = useCart();
  const out = p.availability === "out-of-stock";
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-glow">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block aspect-square overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
        <Link to="/product/$slug" params={{ slug: p.slug }} className="line-clamp-2 font-medium hover:text-primary">{p.name}</Link>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-bold">{formatDZD(p.price, lang)}</span>
          <button
            disabled={out}
            onClick={() => { add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image: p.image }); toast.success(t("added")); }}
            className="flex h-9 items-center gap-1 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            aria-label={`${t("addToCart")}: ${p.name}`}
          >
            <Plus className="size-4" aria-hidden /> <span className="sr-only sm:not-sr-only">{t("addToCart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
