import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Truck, ShieldCheck, Banknote } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useI18n } from "@/lib/i18n";
import { formatDZD } from "@/lib/format";
import { site } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Volt Store — Premium tech, cash on delivery in Algeria" },
      { name: "description", content: "Shop phones, laptops and accessories. Cash on delivery to all 58 wilayas." },
      { property: "og:title", content: "Volt Store — Premium tech in Algeria" },
      { property: "og:description", content: "Phones, laptops and accessories with cash on delivery across Algeria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const slides = [...products.filter((p) => p.featured), ...products].filter((p, i, a) => a.findIndex((x) => x.id === p.id) === i).slice(0, 5);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);
  const s = slides[i % Math.max(slides.length, 1)];

  return (
    <StoreLayout>
      <section className="relative overflow-hidden border-b border-border bg-hero">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          {s ? (
            <>
              <div key={s.id} className="animate-slide-fade">
                <span className="inline-block rounded-full border border-primary/40 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  {s.featured ? t("featured") : t("newArrivals")}
                </span>
                <h1 className="mt-5 text-4xl font-bold text-balance md:text-6xl">{s.name}</h1>
                <p className="mt-4 max-w-md text-muted-foreground">{s.short_description || site.tagline[lang]}</p>
                <p className="mt-6 font-display text-3xl font-bold text-primary">{formatDZD(s.price, lang)}</p>
                <div className="mt-8 flex gap-3">
                  <Link to="/product/$slug" params={{ slug: s.slug }} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-glow">
                    {t("shopNow")} <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                  </Link>
                  <Link to="/shop" className="inline-flex h-11 items-center rounded-lg border border-border px-6 font-medium hover:bg-secondary">{t("viewAll")}</Link>
                </div>
                {slides.length > 1 && (
                  <div className="mt-10 flex gap-2">
                    {slides.map((sl, idx) => (
                      <button key={sl.id} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}: ${sl.name}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-primary" : "w-4 bg-border"}`} />
                    ))}
                  </div>
                )}
              </div>
              <div key={s.id + "img"} className="animate-slide-fade">
                <img src={s.image} alt={s.name} className="mx-auto aspect-square w-full max-w-md rounded-3xl border border-border object-cover shadow-glow" />
              </div>
            </>
          ) : (
            <div className="md:col-span-2 py-10 text-center">
              <h1 className="text-4xl font-bold text-balance md:text-6xl">{site.name}</h1>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{site.tagline[lang]}</p>
              <Link to="/shop" className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-glow">{t("shopNow")}</Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-3">
        {[
          { icon: Truck, en: "Delivery to 58 wilayas", ar: "توصيل إلى 58 ولاية" },
          { icon: Banknote, en: "Cash on delivery", ar: "الدفع عند الاستلام" },
          { icon: ShieldCheck, en: "Genuine products", ar: "منتجات أصلية" },
        ].map((f) => (
          <div key={f.en} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <f.icon className="size-5 text-primary" aria-hidden /> <span className="font-medium">{f[lang]}</span>
          </div>
        ))}
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold">{t("categories")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <Link key={c.id} to="/shop" search={{ category: c.id }} className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-xl border border-border bg-card p-4">
                {c.image && <img src={c.image} alt="" className="absolute inset-0 size-full object-cover opacity-60 transition-transform group-hover:scale-105" />}
                <span className="relative font-display text-lg font-bold">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">{t("newArrivals")}</h2>
          <Link to="/shop" className="text-sm font-medium text-primary">{t("viewAll")}</Link>
        </div>
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">{t("noProducts")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{products.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}</div>
        )}
      </section>
    </StoreLayout>
  );
}
