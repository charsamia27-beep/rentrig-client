"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { TbUsers, TbPackage, TbClipboardList, TbClock, TbCircleCheck, TbCash, TbTruck, TbTrendingUp } from "react-icons/tb";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ErrorBox, PageHeader, StatCard, StatusBadge } from "../ui";
import { ChartCard, DonutChart, SimpleBarChart, TrendChart } from "./Charts";

export default function AdminOverview() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["analytics", "admin"],
    queryFn: async () => (await api.get("/analytics/admin")).data,
  });

  if (isError) return <ErrorBox message="Could not load platform analytics" onRetry={refetch} />;
  const t = data?.totals || {};

  const cards = [
    { label: "Total users", value: t.totalUsers, Icon: TbUsers, tone: "info" },
    { label: "Total equipment", value: t.totalEquipment, Icon: TbPackage, tone: "accent", hint: `${t.approvedEquipment ?? 0} approved` },
    { label: "Total bookings", value: t.totalBookings, Icon: TbClipboardList, tone: "primary" },
    { label: "Pending approvals", value: t.pendingApprovals, Icon: TbClock, tone: "warning" },
    { label: "Active rentals", value: t.activeRentals, Icon: TbTruck, tone: "secondary" },
    { label: "Completed rentals", value: t.completedRentals, Icon: TbCircleCheck, tone: "success" },
    { label: "Total revenue", value: formatCurrency(t.totalRevenue), Icon: TbCash, tone: "accent" },
    {
      label: "Avg. booking value",
      value: formatCurrency(t.totalBookings ? t.totalRevenue / t.totalBookings : 0),
      Icon: TbTrendingUp,
      tone: "primary",
    },
  ];

  return (
    <>
      <PageHeader
        title="Platform analytics"
        sub="Live numbers from the users, equipment, bookings and payments collections."
        action={
          t.pendingApprovals ? (
            <Link href="/dashboard/all-equipment" className="btn btn-warning btn-pill">
              Review {t.pendingApprovals} pending listing(s)
            </Link>
          ) : null
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)
          : cards.map((c) => <StatCard key={c.label} {...c} value={c.value ?? 0} />)}
      </div>

      {!isLoading && (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <ChartCard title="Monthly revenue" sub="Paid Stripe transactions – last 6 months">
              <TrendChart data={data.monthly} dataKey="revenue" label="Revenue" money />
            </ChartCard>
            <ChartCard title="Monthly bookings" sub="New rental bookings – last 6 months">
              <SimpleBarChart data={data.monthly} dataKey="bookings" xKey="month" label="Bookings" color="var(--color-accent)" />
            </ChartCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <ChartCard title="Users by role">
              <DonutChart data={data.roles} />
            </ChartCard>
            <ChartCard title="Bookings by status">
              <DonutChart data={data.bookingStatus} />
            </ChartCard>
            <ChartCard title="Equipment by category">
              <SimpleBarChart data={data.categories} dataKey="value" label="Listings" horizontal color="var(--color-info)" />
            </ChartCard>
          </div>

          <div className="card-surface mt-6 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <h3 className="text-lg font-bold">Latest bookings</h3>
              <Link href="/dashboard/all-rentals" className="link text-sm font-semibold">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBookings.length ? (
                    data.recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td className="font-semibold">{b.equipmentName}</td>
                        <td className="text-sm">{b.customerName}</td>
                        <td className="whitespace-nowrap text-sm">{formatDate(b.createdAt)}</td>
                        <td className="font-bold">{formatCurrency(b.totalAmount)}</td>
                        <td>
                          <StatusBadge value={b.bookingStatus} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-base-content/50">
                        No bookings yet
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
