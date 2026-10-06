import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { StoreLayout } from "@/components/store/StoreLayout";
import type { LandingPage } from "@/lib/types";

const getLanding = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().max(100) }).parse(d))
  .handler(async ({ data }) => {
    const db = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: row } = await db.from("landing_pages").select("*").eq("slug", data.slug).eq("active", true).maybeSingle();
    return (row as LandingPage | null) ?? null;
  });

export const Route = createFileRoute("/l/$slug")({
  loader: async ({ params }) => {
    const page = await getLanding({ data: { slug: params.slug } });
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.page.title} — Volt Store` : "Offer unavailable — Volt Store";
    const hero = loaderData?.page.hero_image;
    return {
      meta: [
        { title },
        { name: "description", content: "Seasonal offer at Volt Store." },
        { property: "og:title", content: title },
        { property: "og:description", content: "Seasonal offer at Volt Store." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(hero ? [{ property: "og:image", content: hero }, { name: "twitter:image", content: hero }] : []),
      ],
    };
  },
  notFoundComponent: () => <StoreLayout><p className="py-24 text-center text-muted-foreground">This offer is not available.</p></StoreLayout>,
  errorComponent: () => <StoreLayout><p className="py-24 text-center text-muted-foreground">Could not load this page.</p></StoreLayout>,
  component: Landing,
});

function Landing() {
  const { page } = Route.useLoaderData();
  return (
    <StoreLayout>
      <section className="relative overflow-hidden border-b border-border bg-hero">
        {page.hero_image && <img src={page.hero_image} alt="" className="absolute inset-0 size-full object-cover opacity-40" />}
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center"><h1 className="text-4xl font-bold text-balance md:text-6xl">{page.title}</h1></div>
      </section>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        {(page.content_blocks ?? []).map((b, i) =>
          b.type === "heading" ? <h2 key={i} className="text-2xl font-bold">{b.value}</h2>
          : b.type === "image" ? <img key={i} src={b.value} alt="" className="w-full rounded-2xl border border-border" />
          : b.type === "cta" ? <a key={i} href={b.link || "/shop"} className="inline-flex h-11 items-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-glow">{b.value}</a>
          : <p key={i} className="whitespace-pre-line leading-relaxed text-muted-foreground">{b.value}</p>)}
      </div>
    </StoreLayout>
  );
}
