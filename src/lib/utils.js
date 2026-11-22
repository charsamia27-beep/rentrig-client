export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const formatCurrency = (n = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(n) || 0);

export const formatDate = (d, opts = {}) => {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC", ...opts });
};

export const unitOf = (rentalType) => ({ daily: "day", weekly: "week", monthly: "month" })[rentalType] || "day";

export const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

/** Client-side mirror of the server's pricing (the server always re-calculates). */
export const calculateRental = ({ rentalPrice, rentalType, startDate, endDate, quantity }) => {
  if (!startDate || !endDate) return null;
  const s = new Date(startDate);
  const e = new Date(endDate);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) return null;
  const rentalDays = Math.round((e - s) / 86400000) + 1;
  const divisor = rentalType === "weekly" ? 7 : rentalType === "monthly" ? 30 : 1;
  const billingUnits = Math.ceil(rentalDays / divisor);
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  return { rentalDays, billingUnits, quantity: qty, total: Math.round(rentalPrice * billingUnits * qty * 100) / 100 };
};

export const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/** Only allow internal redirects (prevents open-redirects via ?redirect=) */
export const safeRedirect = (path) => (typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? path : "/");

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e6dccb"/><g fill="none" stroke="#14213d" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".35"><path d="M120 210h160M150 210l20-60h60l20 60M180 150l10-40h20l10 40"/></g></svg>`
  );

/** Escape user-provided text before putting it inside SweetAlert `html` */
export const escapeHtml = (str = "") =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
