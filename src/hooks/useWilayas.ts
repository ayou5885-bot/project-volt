import { useTable } from "./useTable";
import type { Wilaya } from "@/lib/types";

export function useWilayas(opts: { enabled?: boolean } = {}) {
  return useTable<Wilaya>("wilayas", { key: "wilayas", order: "code", asc: true, pk: "code", ...opts });
}
