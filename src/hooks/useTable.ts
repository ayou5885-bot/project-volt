import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Shared CRUD helper used by the per-table hooks in this folder.
export function useTable<T>(table: string, opts: { order?: string; asc?: boolean; key: string; pk?: string; enabled?: boolean }) {
  const qc = useQueryClient();
  const pk = opts.pk ?? "id";
  const db = supabase as any;
  const query = useQuery({
    queryKey: [opts.key],
    enabled: opts.enabled ?? true,
    queryFn: async () => {
      let q = db.from(table).select("*");
      if (opts.order) q = q.order(opts.order, { ascending: opts.asc ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return data as T[];
    },
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: [opts.key] });
  const upsert = useMutation({
    mutationFn: async (row: Partial<T>) => {
      const { error } = await db.from(table).upsert(row, { onConflict: pk });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq(pk, id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
  return { ...query, upsert, remove, invalidate };
}
