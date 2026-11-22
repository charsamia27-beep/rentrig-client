"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TbClipboardList, TbHeart, TbCash, TbCircleCheck, TbArrowRight, TbCalendarTime } from "react-icons/tb";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState, ErrorBox, StatCard, StatusBadge } from "../ui";

export default function CustomerOverview({ name }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["analytics", "customer"],
    queryFn: async () => (await api.get("/analytics/customer")).data,
  });
  const t = data?.totals || {};

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-neutral p-6 text-neutral-content md:p-8"
      >
        <div className="hazard-stripe absolute -right-10 -top-10 h-32 w-32 rotate-12 rounded-3xl opacity-80" />
        <p className="text-sm opacity-70">Welcome back</p>
        <h1 className="mt-1 text-3xl font-extrabold">{name?.split(" ")[0] || "Renter"} 👋</h1>
        <p className="mt-2 max-w-lg opacity-75">Track your rentals, payments and saved equipment in one place.</p>
        <Link href="/equipment" className="btn btn-primary btn-rig mt-5">
          Rent equipment <TbArrowRight />
        </Link>
      </motion.div>

      {isError ? (
        <ErrorBox onRetry={refetch} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)
          ) : (
            <>
              <StatCard label="Total rentals" value={t.totalRentals ?? 0} Icon={TbClipboardList} />
              <StatCard label="Active rentals" value={t.activeRentals ?? 0} Icon={TbCalendarTime} tone="info" />
              <StatCard label="Completed" value={t.completedRentals ?? 0} Icon={TbCircleCheck} tone="success" />
              <StatCard label="Total spent" value={formatCurrency(t.totalSpent)} Icon={TbCash} tone="accent" hint={`${t.favorites ?? 0} saved favorites`} />
            </>
          )}
        </div>
      )}

      <div className="card-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Upcoming & active rentals</h2>
          <Link href="/dashboard/my-rentals" className="link text-sm font-semibold">
            View all
          </Link>
        </div>
        {data?.upcoming?.length ? (
          <ul className="divide-y divide-base-300">
            {data.upcoming.map((b) => (
              <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <img src={b.equipmentImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold">{b.equipmentName}</p>
                    <p className="text-xs text-base-content/60">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </p>
                  </div>
                </div>
                <StatusBadge value={b.bookingStatus} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No upcoming rentals" text="When you book equipment it will show up here." />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/favorites" className="card-surface flex items-center justify-between p-6 hover:border-primary">
          <span className="flex items-center gap-3 font-bold">
            <TbHeart className="text-2xl text-error" /> Your favorites
          </span>
          <TbArrowRight />
        </Link>
        <Link href="/dashboard/payments" className="card-surface flex items-center justify-between p-6 hover:border-primary">
          <span className="flex items-center gap-3 font-bold">
            <TbCash className="text-2xl text-accent" /> Payment history
          </span>
          <TbArrowRight />
        </Link>
      </div>
    </div>
  );
}
