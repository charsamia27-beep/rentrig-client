"use client";

import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { TbSearch } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import Pagination from "@/components/shared/Pagination";
import { Avatar, EmptyState, ErrorBox, StatusBadge, TableCard, TableSkeleton } from "./ui";

const STATUSES = ["", "confirmed", "active", "completed", "cancelled"];
const OWNER_NEXT = { confirmed: ["active", "cancelled"], active: ["completed"] };
const ALL = ["confirmed", "active", "completed", "cancelled"];

/** Shared rentals table for the owner ("My Equipment Rental") and the admin ("All Rentals"). */
export default function BookingsTable({ endpoint, queryKey, mode = "owner" }) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [queryKey, page, status, term],
    queryFn: async () => (await api.get(endpoint, { params: { page, limit: 10, status, search: term } })).data,
    placeholderData: keepPreviousData,
  });

  const update = useMutation({
    mutationFn: async ({ id, next }) => (await api.patch(`/bookings/${id}/status`, { status: next })).data,
    onSuccess: (d) => {
      toast.success(d.message);
      qc.invalidateQueries({ queryKey: [queryKey] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const changeStatus = async (b, next) => {
    if (next === "cancelled") {
      const r = await Swal.fire({
        title: "Cancel this booking?",
        text: "Units return to stock and the payment is marked refund pending.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Cancel booking",
      });
      if (!r.isConfirmed) return;
    }
    update.mutate({ id: b._id, next });
  };

  const options = (b) => (mode === "admin" ? ALL.filter((s) => s !== b.bookingStatus) : OWNER_NEXT[b.bookingStatus] || []);

  return (
    <>
      <TableCard
        toolbar={
          <>
            <div role="tablist" className="tabs tabs-box w-fit overflow-x-auto rounded-full">
              {STATUSES.map((s) => (
                <button
                  key={s || "all"}
                  role="tab"
                  className={`tab rounded-full capitalize ${status === s ? "tab-active" : ""}`}
                  onClick={() => {
                    setStatus(s);
                    setPage(1);
                  }}
                >
                  {s || "All"}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTerm(search.trim());
                setPage(1);
              }}
              className="join"
            >
              <label className="input join-item input-sm w-56">
                <TbSearch className="opacity-50" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer or equipment" />
              </label>
              <button className="btn btn-sm btn-secondary join-item">Search</button>
            </form>
          </>
        }
      >
        {isLoading ? (
          <TableSkeleton cols={7} />
        ) : isError ? (
          <ErrorBox onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState title="No rentals found" text={mode === "owner" ? "Rentals of your equipment will appear here." : "No booking records match."} />
        ) : (
          <table className={`table ${isFetching ? "opacity-70" : ""}`}>
            <thead>
              <tr>
                <th>Customer Information</th>
                {mode === "admin" && <th>Owner Information</th>}
                <th>Equipment</th>
                <th>Rental Duration</th>
                <th>Qty</th>
                <th>Booking Amount</th>
                <th>Payment</th>
                <th>Booking Status</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar src={b.customerImage} name={b.customerName} />
                      <div className="min-w-0">
                        <p className="font-semibold">{b.customerName}</p>
                        <p className="text-xs text-base-content/55">{b.customerEmail}</p>
                        <p className="text-xs text-base-content/55">{b.contactNumber}</p>
                      </div>
                    </div>
                  </td>
                  {mode === "admin" && (
                    <td>
                      <p className="font-semibold">{b.ownerName || "—"}</p>
                      <p className="text-xs text-base-content/55">{b.ownerEmail}</p>
                    </td>
                  )}
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={b.equipmentImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold">{b.equipmentName}</p>
                        <p className="max-w-[200px] truncate text-xs text-base-content/55" title={b.deliveryAddress}>
                          📍 {b.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-sm">
                    {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    <p className="text-xs text-base-content/55">{b.rentalDays} day(s)</p>
                  </td>
                  <td>{b.quantity}</td>
                  <td className="font-bold">{formatCurrency(b.totalAmount)}</td>
                  <td>
                    <StatusBadge type="payment" value={b.paymentStatus} />
                  </td>
                  <td>
                    <StatusBadge value={b.bookingStatus} />
                  </td>
                  <td className="text-right">
                    {options(b).length ? (
                      <select
                        className="select select-xs w-32 rounded-full"
                        value=""
                        disabled={update.isPending}
                        onChange={(e) => e.target.value && changeStatus(b, e.target.value)}
                        aria-label="Change booking status"
                      >
                        <option value="">Mark as…</option>
                        {options(b).map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-base-content/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
      <Pagination className="mt-6" page={page} totalPages={data?.totalPages} onChange={setPage} />
    </>
  );
}
