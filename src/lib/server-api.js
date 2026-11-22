import "server-only";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch a PUBLIC endpoint from a Server Component. Never throws – returns `fallback`
 * so a slow/unavailable API can never crash the landing page.
 */
export async function serverGet(path, fallback = null) {
  try {
    const res = await fetch(`${baseURL}${path}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}
