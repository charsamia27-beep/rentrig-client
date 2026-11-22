import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" className="fill-secondary" />
      <path
        d="M18 46V18h15a9 9 0 0 1 0 18h-7l12 10"
        fill="none"
        className="stroke-primary"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="20" r="4" className="fill-primary" />
    </svg>
  );
}

export default function Logo({ href = "/", className = "", light = false }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="RentRig home">
      <LogoMark />
      <span className={`font-display text-2xl font-extrabold tracking-tight ${light ? "text-white" : ""}`}>
        Rent<span className="text-primary">Rig</span>
      </span>
    </Link>
  );
}
