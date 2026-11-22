"use client";

import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ------------------------------------------------------------------ */
/*  Access token (JWT) issued by Better Auth – cached in memory only   */
/* ------------------------------------------------------------------ */
let cached = null; // { token, exp }
let inflight = null;

const decodeExp = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return (payload.exp || 0) * 1000;
  } catch {
    return 0;
  }
};

/** Returns a valid access token, generating a fresh one from the Better Auth session when needed. */
export async function getAccessToken(force = false) {
  if (!force && cached && cached.exp - Date.now() > 60_000) return cached.token;
  if (inflight) return inflight;
  inflight = fetch("/api/auth/token", { credentials: "include", cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.token) return null;
      cached = { token: data.token, exp: decodeExp(data.token) };
      return data.token;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export const clearAccessToken = () => {
  cached = null;
};

/* ------------------------------------------------------------------ */
/*  Axios instances                                                    */
/* ------------------------------------------------------------------ */

/** Public endpoints – no token */
export const publicApi = axios.create({ baseURL, timeout: 20000 });

/** Private endpoints – attaches "Authorization: Bearer <jwt>" and retries once on 401 */
const api = axios.create({ baseURL, timeout: 20000 });

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      const token = await getAccessToken(true);
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const errorMessage = (err, fallback = "Something went wrong. Please try again.") =>
  err?.response?.data?.message || err?.message || fallback;
