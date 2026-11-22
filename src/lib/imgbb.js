"use client";

const MAX_MB = 5;

/** Uploads an image File to imgbb and returns the direct image URL. */
export async function uploadToImgbb(file) {
  if (!file) throw new Error("Please choose an image");
  if (!file.type?.startsWith("image/")) throw new Error("Only image files are allowed");
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`Image must be smaller than ${MAX_MB}MB`);

  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not configured (NEXT_PUBLIC_IMGBB_KEY missing)");

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) throw new Error(json?.error?.message || "Image upload failed");
  return json.data.url || json.data.display_url;
}
