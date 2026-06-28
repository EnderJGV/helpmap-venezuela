// Photo handling for the public intake form.
//
// Flow (offline-first, CLAUDE.md §6/§7):
//   1. On selection we resize + compress the image in the browser to a small
//      JPEG data URL (keeps localStorage light and respects low bandwidth).
//   2. That data URL rides in the offline queue until there is a connection.
//   3. On flush we upload the blob to a PRIVATE Supabase Storage bucket with the
//      anon key (insert-only policy) and forward only the resulting object PATH
//      to n8n — never the binary, never a public URL.
//
// PRIVACY: a photo must NEVER exist for a minor (CLAUDE.md §2/§5). The caller
// guards on is_minor; this module is only ever invoked for adults.

import { createClient } from "@/utils/supabase/client";

// Private bucket. Override via env if the project provisioned a different name.
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_INTAKE_BUCKET ?? "intake-photos";

const MAX_DIM = 1024; // px, longest side
const QUALITY = 0.7;

// Resize + compress a selected File into a JPEG data URL. Rejects on read error.
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not_an_image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no_canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode_failed"));
    };
    img.src = url;
  });
}

// Uploads a JPEG data URL to the intake bucket and returns the public URL of the
// object (this is what the DB column `foto_url` stores and n8n writes to the
// spreadsheet). Throws on failure so the queue can decide to retry.
// NOTE: the URL is only openable if the bucket is public-read.
export async function uploadIntakePhoto(dataUrl: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob();
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now());
  // Namespaced, unguessable path. No PII in the filename.
  const path = `intake/${id}.jpg`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
