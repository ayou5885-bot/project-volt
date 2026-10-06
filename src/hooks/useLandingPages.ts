import { useTable } from "./useTable";
import type { LandingPage } from "@/lib/types";

export function useLandingPages(opts: { enabled?: boolean } = {}) {
  return useTable<LandingPage>("landing_pages", { key: "landing_pages", order: "created_at", asc: false, pk: "slug", ...opts });
}
