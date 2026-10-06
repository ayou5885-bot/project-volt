import { useTable } from "./useTable";
import type { Coupon } from "@/lib/types";

export function useCoupons(opts: { enabled?: boolean } = {}) {
  return useTable<Coupon>("coupons", { key: "coupons", order: "created_at", asc: false, pk: "id", ...opts });
}
