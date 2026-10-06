import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

// Serves the admin-uploaded favicon (stored at site/favicon in the image bucket), falling back to the default.
export const Route = createFileRoute("/api/public/favicon")({
  server: {
    handlers: {
      GET: async () => {
        const db = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data } = await db.storage.from("store-images").createSignedUrl("site/favicon", 3600);
        const target = data?.signedUrl ?? "/favicon.ico";
        return new Response(null, { status: 302, headers: { Location: target, "Cache-Control": "public, max-age=300" } });
      },
    },
  },
});
