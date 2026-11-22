"use client";

import { TbInbox } from "react-icons/tb";
import { BOOKING_STATUS_STYLES, EQUIPMENT_STATUS_STYLES, PAYMENT_STATUS_STYLES, ROLE_STYLES } from "@/lib/constants";

export function PageHeader({ title, sub, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-base-content/60">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, Icon, tone = "primary", hint }) {
  const tones = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    info: "bg-info/15 text-info",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    error: "bg-error/15 text-error",
    secondary: "bg-secondary/10 text-secondary",
  };
  return (
    <div className="card-surface flex items-start justify-between gap-3 p-5">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">{label}</p>
        <p className="mt-2 truncate font-display text-3xl font-extrabold">{value}</p>
        {hint && <p className="mt-1 text-xs text-base-content/55">{hint}</p>}
      </div>
      {Icon && (
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ${tones[tone]}`}>
          <Icon />
        </span>
      )}
    </div>
  );
}

const styleMaps = { booking: BOOKING_STATUS_STYLES, payment: PAYMENT_STATUS_STYLES, equipment: EQUIPMENT_STATUS_STYLES, role: ROLE_STYLES };

export function StatusBadge({ type = "booking", value }) {
  const cls = styleMaps[type]?.[value] || "badge-ghost";
  return <span className={`badge badge-sm whitespace-nowrap font-semibold capitalize ${cls}`}>{value || "—"}</span>;
}

export function EmptyState({ title = "Nothing here yet", text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-base-200 text-3xl text-base-content/40">
        <TbInbox />
      </span>
      <p className="text-lg font-bold">{title}</p>
      {text && <p className="max-w-sm text-sm text-base-content/60">{text}</p>}
      {action}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="skeleton h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function TableCard({ children, toolbar }) {
  return (
    <div className="card-surface overflow-hidden">
      {toolbar && <div className="flex flex-col gap-3 border-b border-base-300 p-4 md:flex-row md:items-center md:justify-between">{toolbar}</div>}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <p className="font-semibold text-error">{message || "Failed to load data"}</p>
      {onRetry && (
        <button className="btn btn-sm btn-outline rounded-full" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export const Avatar = ({ src, name, className = "h-10 w-10" }) => (
  <img
    src={src || `https://ui-avatars.com/api/?background=14213d&color=f59e0b&bold=true&name=${encodeURIComponent(name || "U")}`}
    alt={name || ""}
    referrerPolicy="no-referrer"
    className={`${className} shrink-0 rounded-xl object-cover`}
  />
);
