"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { TbStar, TbX, TbStarFilled } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import Pagination from "@/components/shared/Pagination";
import { EmptyState, ErrorBox, PageHeader, StatusBadge, TableCard, TableSkeleton } from "@/components/dashboard/ui";

const STATUSES = ["", "confirmed", "active", "completed", "cancelled"];

function ReviewModal({ booking, onClose }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const m = useMutation({
    mutationFn: async () => (await api.post("/reviews", { bookingId: booking._id, rating, comment })).data,
    onSuccess: (d) => {
      toast.success(d.message);
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
      onClose();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box rounded-3xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-extrabold">Review your rental</h3>
            <p className="text-sm text-base-content/60">{booking.equipmentName}</p>
          </div>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose}>
            <TbX />
          </button>
        </div>
        <div className="mt-5 flex gap-1 text-3xl text-primary" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onMouseEnter={() => setHover(n)} onClick={() => setRating(n)} aria-label={`${n} stars`}>
              {(hover || rating) >= n ? <TbStarFilled /> : <TbStar />}
            </button>
          ))}
        </div>
        <textarea
          className="textarea mt-4 w-full"
          rows={4}
          maxLength={600}
          placeholder="How was the equipment and the owner? (min. 10 characters)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn btn-ghost btn-pill" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-rig" disabled={m.isPending || comment.trim().length < 10} onClick={() => m.mutate()}>
            {m.isPending && <span className="loading loading-spinner loading-sm" />} Submit review
          </button>
        </div>
      </div>
      <button className="modal-backdrop" onClick={onClose} aria-label="Close" />
    </div>
  );
}

export default function MyRentalsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [reviewing, setReviewing] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["my-rentals", page, status],
    queryFn: async () => (await api.get("/bookings/me", { params: { page, limit: 8, status } })).data,
    placeholderData: keepPreviousData,
  });

  const cancel = useMutation({
    mutationFn: async (id) => (await api.patch(`/bookings/${id}/status`, { status: "cancelled" })).data,
    onSuccess: (d) => {
      toast.success(d.message);
      qc.invalidateQueries({ queryKey: ["my-rentals"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const confirmCancel = async (b) => {
    const r = await Swal.fire({
      title: "Cancel this rental?",
      text: `${b.equipmentName} – the payment will be marked "refund pending".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      confirmButtonColor: "#dc2626",
    });
    if (r.isConfirmed) cancel.mutate(b._id);
  };

  return (
    <>
      <PageHeader title="My Rentals" sub="All of your rental bookings, newest first." />
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
            <p className="text-sm text-base-content/60">
              {data?.total ?? 0} booking(s) {isFetching && <span className="loading loading-dots loading-xs" />}
            </p>
          </>
        }
      >
        {isLoading ? (
          <TableSkeleton cols={7} />
        ) : isError ? (
          <ErrorBox onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState
            title="No rentals yet"
            text="Find the equipment you need and book it in minutes."
            action={
              <Link href="/equipment" className="btn btn-primary btn-rig btn-sm">
                Browse equipment
              </Link>
            }
          />
        ) : (
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Rental Start Date</th>
                <th>Rental End Date</th>
                <th>Booking Date</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Booking Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={b.equipmentImage} alt="" className="h-11 w-11 rounded-xl object-cover" />
                      <div>
                        <Link href={`/equipment/${b.equipmentId}`} className="font-semibold hover:text-accent">
                          {b.equipmentName}
                        </Link>
                        <p className="text-xs text-base-content/55">
                          {b.quantity} unit(s) · {b.rentalDays} day(s)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">{formatDate(b.startDate)}</td>
                  <td className="whitespace-nowrap">{formatDate(b.endDate)}</td>
                  <td className="whitespace-nowrap">{formatDate(b.createdAt)}</td>
                  <td className="font-bold">{formatCurrency(b.totalAmount)}</td>
                  <td>
                    <StatusBadge type="payment" value={b.paymentStatus} />
                  </td>
                  <td>
                    <StatusBadge value={b.bookingStatus} />
                  </td>
                  <td className="text-right">
                    {b.bookingStatus === "completed" && !b.reviewed && (
                      <button className="btn btn-xs btn-primary rounded-full" onClick={() => setReviewing(b)}>
                        <TbStar /> Review
                      </button>
                    )}
                    {b.bookingStatus === "completed" && b.reviewed && <span className="text-xs text-success">Reviewed ✓</span>}
                    {b.bookingStatus === "confirmed" && new Date(b.startDate) > new Date() && (
                      <button className="btn btn-xs btn-outline btn-error rounded-full" disabled={cancel.isPending} onClick={() => confirmCancel(b)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
      <Pagination className="mt-6" page={page} totalPages={data?.totalPages} onChange={setPage} />
      {reviewing && <ReviewModal booking={reviewing} onClose={() => setReviewing(null)} />}
    </>
  );
}
