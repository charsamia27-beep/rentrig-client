"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { TbCircleCheck, TbPrinter, TbReceipt, TbArrowRight, TbAlertTriangle } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LogoMark } from "@/components/shared/Logo";

export default function PaymentSuccessClient({ sessionId }) {
  const qc = useQueryClient();
  const started = useRef(false);
  const [state, setState] = useState({ status: "loading", data: null, error: "" });

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!sessionId) {
      setState({ status: "error", data: null, error: "Missing payment session." });
      return;
    }
    const confirm = async (attempt = 0) => {
      try {
        const { data } = await api.post("/payments/confirm", { sessionId });
        setState({ status: "done", data, error: "" });
        qc.invalidateQueries({ queryKey: ["my-rentals"] });
      } catch (err) {
        // Stripe can take a moment to mark the session paid – retry a few times
        if (err?.response?.status === 402 && attempt < 4) return setTimeout(() => confirm(attempt + 1), 1500);
        setState({ status: "error", data: null, error: errorMessage(err) });
      }
    };
    confirm();
  }, [sessionId, qc]);

  if (state.status === "loading")
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="loading loading-ring loading-lg text-primary" />
        <p className="font-semibold">Confirming your payment with Stripe…</p>
      </div>
    );

  if (state.status === "error")
    return (
      <div className="card-surface mx-auto flex max-w-lg flex-col items-center gap-3 p-10 text-center">
        <TbAlertTriangle className="text-5xl text-warning" />
        <h1 className="text-2xl font-extrabold">We couldn&apos;t confirm this payment</h1>
        <p className="text-base-content/70">{state.error}</p>
        <Link href="/dashboard/my-rentals" className="btn btn-secondary btn-pill mt-2">
          Check My Rentals
        </Link>
      </div>
    );

  const { booking, payment } = state.data;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <div className="no-print mb-8 flex flex-col items-center text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-success text-5xl text-success-content"
        >
          <TbCircleCheck />
        </motion.span>
        <h1 className="mt-5 text-3xl font-extrabold md:text-4xl">Payment successful!</h1>
        <p className="mt-2 text-base-content/70">Your rental is confirmed. A receipt is below and the booking is in your dashboard.</p>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between bg-secondary px-6 py-5 text-secondary-content">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <div>
              <p className="font-display text-lg font-extrabold">RentRig receipt</p>
              <p className="text-xs opacity-70">Paid {formatDate(payment?.paidAt || booking?.createdAt)}</p>
            </div>
          </div>
          <TbReceipt className="text-3xl text-primary" />
        </div>
        <dl className="divide-y divide-dashed divide-base-300 px-6">
          {[
            ["Equipment", booking?.equipmentName],
            ["Rental period", `${formatDate(booking?.startDate)} → ${formatDate(booking?.endDate)} (${booking?.rentalDays} day${booking?.rentalDays > 1 ? "s" : ""})`],
            ["Quantity", booking?.quantity],
            ["Delivery address", booking?.deliveryAddress],
            ["Contact", booking?.contactNumber],
            ["Booking status", <span key="s" className="badge badge-info capitalize">{booking?.bookingStatus}</span>],
            ["Payment status", <span key="p" className="badge badge-success capitalize">{booking?.paymentStatus}</span>],
            ["Transaction ID", <code key="t" className="break-all text-xs">{payment?.transactionId}</code>],
            ["Booking ID", <code key="b" className="break-all text-xs">{String(booking?._id || "")}</code>],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
              <dt className="text-sm text-base-content/60">{k}</dt>
              <dd className="font-semibold sm:text-right">{v}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between py-5">
            <dt className="text-lg font-bold">Total paid</dt>
            <dd className="font-display text-3xl font-extrabold">{formatCurrency(payment?.amount ?? booking?.totalAmount)}</dd>
          </div>
        </dl>
      </div>

      <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={() => window.print()} className="btn btn-outline btn-pill">
          <TbPrinter /> Print receipt
        </button>
        <Link href="/dashboard/my-rentals" className="btn btn-primary btn-rig">
          Go to My Rentals <TbArrowRight />
        </Link>
      </div>
    </motion.div>
  );
}
