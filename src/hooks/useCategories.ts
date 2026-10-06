import { useTable } from "./useTable";
import type { Category } from "@/lib/types";

export function useCategories(opts: { enabled?: boolean } = {}) {
  return useTable<Category>("categories", { key: "categories", order: "name", asc: true, pk: "id", ...opts });
}
