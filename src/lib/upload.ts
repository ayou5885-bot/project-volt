import { supabase } from "@/integrations/supabase/client";

// The workspace blocks public buckets, so images live in a private bucket and
// are served through long-lived signed URLs (anyone may read via the bucket policy).
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("store-images").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("store-images").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw e2 ?? new Error("Could not sign URL");
  return data.signedUrl;
}
