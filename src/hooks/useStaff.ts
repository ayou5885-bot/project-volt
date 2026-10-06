import { useTable } from "./useTable";
import type { StaffMember } from "@/lib/types";

export function useStaff(opts: { enabled?: boolean } = {}) {
  return useTable<StaffMember>("staff", { key: "staff", order: "created_at", asc: true, pk: "id", ...opts });
}
