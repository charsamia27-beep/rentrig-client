"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

/** Compact pagination with ellipsis: 1 … 4 5 [6] 7 8 … 20 */
export default function Pagination({ page, totalPages, onChange, className = "" }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const add = (p) => pages.push(p);
  const span = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - span && p <= page + span)) add(p);
    else if (pages[pages.length - 1] !== "…") add("…");
  }

  return (
    <nav className={`flex items-center justify-center gap-1.5 ${className}`} aria-label="Pagination">
      <button className="btn btn-sm btn-circle btn-ghost" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <HiChevronLeft />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-base-content/40">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`btn btn-sm btn-circle ${p === page ? "btn-secondary" : "btn-ghost"}`}
          >
            {p}
          </button>
        )
      )}
      <button className="btn btn-sm btn-circle btn-ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <HiChevronRight />
      </button>
    </nav>
  );
}
