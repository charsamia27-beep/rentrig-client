"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { TbPackage, TbCircleCheck, TbCash, TbTruck, TbClock, TbPlus } from "react-icons/tb";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState, ErrorBox, PageHeader, StatCard, StatusBadge } from "../ui";
import { ChartCard, SimpleBarChart, TrendChart } from "./Charts";

export default function OwnerOverview({ name }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["analytics", "owner"],
    queryFn: async () => (await api.get("/analytics/owner")).data,
  });

  if (isError) return <ErrorBox message="Could not load your analytics" onRetry={refetch} />;
  const t = data?.totals || {};

  return (
    <>
      <PageHeader
        title={`Hi ${name?.split(" ")[0] || "there"}, here's your rental business`}
        sub="Earnings and rentals calculated from your equipment, bookings and payments."
        action={
          <Link href="/dashboard/add-equipment" className="btn btn-primary btn-rig">
            <TbPlus /> Add equipment
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)
        ) : (
          <>
            <StatCard label="Listed equipment" value={t.totalListed ?? 0} Icon={TbPackage} tone="info" hint={`${t.approved ?? 0} approved · ${t.rejected ?? 0} rejected`} />
            <StatCard label="Pending approval" value={t.pending ?? 0} Icon={TbClock} tone="warning" />
            <StatCard label="Active rentals" value={t.activeRentals ?? 0} Icon={TbTruck} tone="secondary" />
            <StatCard label="Completed rentals" value={t.completedRentals ?? 0} Icon={TbCircleCheck} tone="success" />
            <StatCard label="Total earnings" value={formatCurrency(t.totalEarnings)} Icon={TbCash} tone="accent" hint={`${t.totalBookings ?? 0} bookings overall`} />
          </>
        )}
      </div>

      {!isLoading && (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <ChartCard title="Monthly earnings" sub="Paid rentals of your equipment – last 6 months">
              <TrendChart data={data.monthly} dataKey="earnings" label="Earnings" money color="var(--color-accent)" />
            </ChartCard>
            <ChartCard title="Top earning equipment">
              {data.topEquipment.length ? (
                <SimpleBarChart data={data.topEquipment} dataKey="earnings" label="Earnings" money horizontal color="var(--color-primary)" />
              ) : (
                <EmptyState title="No earnings yet" text="Once your equipment is rented, the top performers show up here." />
              )}
            </ChartCard>
          </div>

          <div className="card-surface mt-6 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <h3 className="text-lg font-bold">Recent rentals</h3>
              <Link href="/dashboard/equipment-rentals" className="link text-sm font-semibold">
                Manage rentals
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Customer</th>
                    <th>Period</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentRentals.length ? (
                    data.recentRentals.map((b) => (
                      <tr key={b._id}>
                        <td className="font-semibold">{b.equipmentName}</td>
                        <td className="text-sm">{b.customerName}</td>
                        <td className="whitespace-nowrap text-sm">
                          {formatDate(b.startDate)} → {formatDate(b.endDate)}
                        </td>
                        <td className="font-bold">{formatCurrency(b.totalAmount)}</td>
                        <td>
                          <StatusBadge value={b.bookingStatus} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-base-content/50">
                        No rentals yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
