"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TbMapPin,
  TbHeart,
  TbHeartFilled,
  TbCalendarTime,
  TbShieldCheck,
  TbStarFilled,
  TbPackage,
  TbTag,
  TbAward,
  TbClipboardList,
  TbArrowLeft,
  TbPhone,
} from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { FALLBACK_IMAGE, capitalize, formatCurrency, formatDate, unitOf } from "@/lib/utils";
import CategoryIcon from "@/components/shared/CategoryIcon";
import { Stars } from "@/components/home/ReviewsSection";
import EquipmentCard from "./EquipmentCard";
import BookingModal from "./BookingModal";

export default function EquipmentDetailsClient({ item, user, reviews = [], similar = [], paymentCancelled = false }) {
  const qc = useQueryClient();
  const [booking, setBooking] = useState(false);
  const isCustomer = (user?.role || "customer") === "customer";
  const isApproved = item.status === "approved";
  const available = (item.availableQuantity ?? 0) > 0;

  useEffect(() => {
    if (paymentCancelled) toast.error("Payment was cancelled – your booking was not created.");
  }, [paymentCancelled]);

  const { data: favIds = [] } = useQuery({
    queryKey: ["favorite-ids"],
    queryFn: async () => (await api.get("/favorites/ids")).data,
    enabled: isCustomer,
  });
  const isFav = favIds.includes(item._id);

  const favMutation = useMutation({
    mutationFn: async () =>
      isFav ? (await api.delete(`/favorites/${item._id}`)).data : (await api.post("/favorites", { equipmentId: item._id })).data,
    onSuccess: (d) => {
      toast.success(d.message);
      qc.invalidateQueries({ queryKey: ["favorite-ids"] });
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const specs = [
    { Icon: TbTag, label: "Category", value: item.category },
    { Icon: TbCalendarTime, label: "Rental type", value: capitalize(item.rentalType) },
    { Icon: TbMapPin, label: "Location", value: item.location },
    { Icon: TbPackage, label: "Available quantity", value: `${item.availableQuantity ?? 0} of ${item.quantity ?? 0}` },
    { Icon: TbAward, label: "Condition", value: item.condition || "—" },
    { Icon: TbClipboardList, label: "Brand / Model", value: [item.brand, item.model].filter(Boolean).join(" · ") || "—" },
  ];

  const blockedReason = !isApproved
    ? `This listing is ${item.status} and can't be booked yet.`
    : !isCustomer
      ? `You're signed in as ${user?.role}. Only customer accounts can rent or save equipment.`
      : !available
        ? "All units are currently rented out. Save it to favorites and check back soon."
        : null;

  return (
    <div className="container-x py-8 md:py-12">
      <Link href="/equipment" className="btn btn-ghost btn-sm mb-6 rounded-full">
        <TbArrowLeft /> Back to all equipment
      </Link>

      {!isApproved && (
        <div role="alert" className="alert alert-warning mb-6 rounded-2xl">
          <span>
            Status: <b className="capitalize">{item.status}</b>
            {item.rejectionReason ? ` – ${item.rejectionReason}` : " – visible to you because you have access to this listing."}
          </span>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative overflow-hidden rounded-[2rem] border border-base-300 bg-base-200">
            <img
              src={item.image || FALLBACK_IMAGE}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="aspect-[4/3] w-full object-cover"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-base-100/90 px-4 py-1.5 text-sm font-bold backdrop-blur">
              <CategoryIcon category={item.category} className="text-accent" /> {item.category}
            </span>
          </div>

          <div className="mt-8">
            <h1 className="text-3xl font-extrabold md:text-4xl">{item.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-base-content/65">
              <span className="inline-flex items-center gap-1">
                <TbMapPin /> {item.location}
              </span>
              {item.rating > 0 && (
                <span className="inline-flex items-center gap-1 font-semibold text-base-content">
                  <TbStarFilled className="text-primary" /> {Number(item.rating).toFixed(1)} ({item.reviewCount || 0} reviews)
                </span>
              )}
              <span>{item.bookingCount || 0} rentals</span>
              <span>Listed {formatDate(item.createdAt)}</span>
            </div>
            <p className="mt-6 whitespace-pre-line leading-relaxed text-base-content/80">{item.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {specs.map(({ Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-base-300 p-4">
                <Icon className="text-xl text-accent" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">{label}</p>
                <p className="mt-0.5 font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <TbShieldCheck className="text-accent" /> Rental terms & conditions
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-base-content/75">{item.terms || "Standard RentRig rental terms apply."}</p>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold">Renter reviews</h2>
            {reviews.length ? (
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-2xl border border-base-300 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold">{r.customerName}</p>
                      <Stars value={r.rating} className="text-sm" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/75">{r.comment}</p>
                    <p className="mt-2 text-xs text-base-content/45">{formatDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-base-content/60">No reviews yet – renters can review after their rental is completed.</p>
            )}
          </div>
        </motion.div>

        {/* booking card */}
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface overflow-hidden">
            <div className="hazard-stripe h-2" />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">{item.rentalType} rental price</p>
              <p className="font-display text-5xl font-extrabold">
                {formatCurrency(item.rentalPrice)}
                <span className="text-lg font-semibold text-base-content/50"> / {unitOf(item.rentalType)}</span>
              </p>
              <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${available ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {available ? `${item.availableQuantity} unit(s) available` : "Currently booked out"}
              </p>

              <div className="mt-6 grid gap-3">
                <button className="btn btn-primary btn-rig h-12" disabled={Boolean(blockedReason)} onClick={() => setBooking(true)}>
                  <TbCalendarTime /> Book Now
                </button>
                <button
                  className={`btn btn-pill h-12 ${isFav ? "btn-error btn-outline" : "btn-outline"}`}
                  disabled={!isCustomer || favMutation.isPending}
                  onClick={() => favMutation.mutate()}
                >
                  {favMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : isFav ? <TbHeartFilled /> : <TbHeart />}
                  {isFav ? "Remove from favorites" : "Add to favorites"}
                </button>
              </div>
              {blockedReason && <p className="mt-3 rounded-xl bg-base-200 p-3 text-sm text-base-content/70">{blockedReason}</p>}
            </div>

            <div className="border-t border-base-300 p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-base-content/50">Owner information</p>
              <div className="flex items-center gap-3">
                <img
                  src={item.owner?.image || `https://ui-avatars.com/api/?background=0f766e&color=fff&bold=true&name=${encodeURIComponent(item.owner?.name || "Owner")}`}
                  alt={item.owner?.name}
                  className="h-12 w-12 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 font-bold">
                    {item.owner?.name || "RentRig owner"} <TbShieldCheck className="text-accent" title="Verified owner" />
                  </p>
                  <p className="truncate text-sm text-base-content/60">{item.owner?.email || item.ownerEmail}</p>
                  {item.owner?.phone && (
                    <p className="flex items-center gap-1 text-sm text-base-content/60">
                      <TbPhone /> {item.owner.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">Similar equipment</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => (
              <EquipmentCard key={s._id} item={s} index={i} />
            ))}
          </div>
        </section>
      )}

      {booking && <BookingModal item={item} user={user} onClose={() => setBooking(false)} />}
    </div>
  );
}
