import { useTable } from "./useTable";
import type { Order } from "@/lib/types";

export function useOrders(opts: { enabled?: boolean } = {}) {
  return useTable<Order>("orders", { key: "orders", order: "created_at", asc: false, pk: "id", ...opts });
}
