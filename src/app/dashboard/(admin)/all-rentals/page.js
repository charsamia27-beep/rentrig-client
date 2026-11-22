"use client";

import BookingsTable from "@/components/dashboard/BookingsTable";
import { PageHeader } from "@/components/dashboard/ui";

export default function AllRentalsPage() {
  return (
    <>
      <PageHeader title="All Rentals" sub="Monitor and manage every rental booking on the platform." />
      <BookingsTable endpoint="/admin/bookings" queryKey="admin-rentals" mode="admin" />
    </>
  );
}
