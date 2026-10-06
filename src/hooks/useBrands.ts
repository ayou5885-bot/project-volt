import { useTable } from "./useTable";
import type { Brand } from "@/lib/types";

export function useBrands(opts: { enabled?: boolean } = {}) {
  return useTable<Brand>("brands", { key: "brands", order: "name", asc: true, pk: "id", ...opts });
}
