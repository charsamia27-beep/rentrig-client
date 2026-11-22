"use client";

import BookingsTable from "@/components/dashboard/BookingsTable";
import { PageHeader } from "@/components/dashboard/ui";

export default function OwnerRentalsPage() {
  return (
    <>
      <PageHeader title="My Equipment Rental" sub="Bookings made on your equipment. Move them from confirmed → active → completed." />
      <BookingsTable endpoint="/bookings/owner" queryKey="owner-rentals" mode="owner" />
    </>
  );
}
