import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Moon, ShoppingBag, Sun, Zap, Instagram, Facebook, MessageCircle, Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { site } from "@/config/site";

export function StoreLayout({ children }: { children: ReactNode }) {
  const { t, lang, setLang, theme, toggleTheme } = useI18n();
  const { count } = useCart();
  const nav = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Zap className="size-4" aria-hidden /></span>
            {site.name}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className={nav} activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>{t("home")}</Link>
            <Link to="/shop" className={nav} activeProps={{ className: "text-foreground" }}>{t("shop")}</Link>
            <Link to="/track" className={nav} activeProps={{ className: "text-foreground" }}>{t("track")}</Link>
          </nav>
          <div className="ms-auto flex items-center gap-1">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex h-9 items-center gap-1.5 rounded-md px-3 text-sm hover:bg-secondary" aria-label={t("switchLang")}>
              <Languages className="size-4" aria-hidden /> <span>{t("switchLang")}</span>
            </button>
            <button onClick={toggleTheme} className="grid size-9 place-items-center rounded-md hover:bg-secondary" aria-label={t("toggleTheme")} title={t("toggleTheme")}>
              {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
            </button>
            <Link to="/cart" className="relative flex h-9 items-center gap-2 rounded-md px-3 text-sm hover:bg-secondary">
              <ShoppingBag className="size-4" aria-hidden /> <span className="hidden sm:inline">{t("cart")}</span>
              {count > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">{count}</span>}
            </Link>
          </div>
        </div>
        <nav className="flex gap-5 border-t border-border px-4 py-2 md:hidden">
          <Link to="/" className={nav}>{t("home")}</Link>
          <Link to="/shop" className={nav}>{t("shop")}</Link>
          <Link to="/track" className={nav}>{t("track")}</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-20 border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">{site.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{site.tagline[lang]}</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="mb-3 font-semibold">{t("contact")}</p>
            <p><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-muted-foreground hover:text-foreground" dir="ltr">{site.phone}</a></p>
            <p><a href={`mailto:${site.email}`} className="text-muted-foreground hover:text-foreground">{site.email}</a></p>
            <p className="text-muted-foreground">{site.address[lang]}</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold">{t("followUs")}</p>
            <ul className="space-y-2">
              <li><a href={site.social.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"><MessageCircle className="size-4" aria-hidden /> WhatsApp</a></li>
              <li><a href={site.social.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"><Instagram className="size-4" aria-hidden /> Instagram</a></li>
              <li><a href={site.social.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"><Facebook className="size-4" aria-hidden /> Facebook</a></li>
            </ul>
          </div>
        </div>
        <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {site.name}. {t("rights")}</p>
      </footer>
    </div>
  );
}
