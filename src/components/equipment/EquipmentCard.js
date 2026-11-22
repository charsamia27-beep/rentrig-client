"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbMapPin, TbStarFilled, TbArrowUpRight } from "react-icons/tb";
import { useSession } from "@/lib/auth-client";
import { FALLBACK_IMAGE, formatCurrency, unitOf } from "@/lib/utils";
import CategoryIcon from "@/components/shared/CategoryIcon";

export default function EquipmentCard({ item, index = 0, animate = true }) {
  const { data: session } = useSession();
  const detailsHref = `/equipment/${item._id}`;
  // Not logged in → go to login first, then come back to the details page
  const href = session?.user ? detailsHref : `/login?redirect=${encodeURIComponent(detailsHref)}`;
  const available = (item.availableQuantity ?? 0) > 0;

  const Wrapper = animate ? motion.article : "article";
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, delay: (index % 6) * 0.07, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  return (
    <Wrapper {...motionProps} className="group card-surface flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-base-200">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-base-100/90 px-3 py-1 text-xs font-bold backdrop-blur">
          <CategoryIcon category={item.category} className="text-accent" />
          {item.category}
        </span>
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            available ? "bg-success text-success-content" : "bg-error text-error-content"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full bg-current ${available ? "animate-pulse" : ""}`} />
          {available ? `${item.availableQuantity} available` : "Booked out"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold" title={item.name}>
            {item.name}
          </h3>
          {item.rating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold">
              <TbStarFilled className="text-primary" /> {Number(item.rating).toFixed(1)}
            </span>
          )}
        </div>
        <p className="mb-5 mt-1.5 flex items-center gap-1.5 text-sm text-base-content/60">
          <TbMapPin className="shrink-0" /> <span className="line-clamp-1">{item.location}</span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-base-300 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">{item.rentalType} rate</p>
            <p className="font-display text-2xl font-extrabold">
              {formatCurrency(item.rentalPrice)}
              <span className="text-sm font-semibold text-base-content/50"> /{unitOf(item.rentalType)}</span>
            </p>
          </div>
          <Link href={href} className="btn btn-secondary btn-sm h-10 rounded-full px-4" aria-label={`View details of ${item.name}`}>
            View Details <TbArrowUpRight />
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}

export function EquipmentCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}
