import { useTable } from "./useTable";
import type { Product } from "@/lib/types";

export function useProducts(opts: { enabled?: boolean } = {}) {
  return useTable<Product>("products", { key: "products", order: "created_at", asc: false, pk: "id", ...opts });
}
