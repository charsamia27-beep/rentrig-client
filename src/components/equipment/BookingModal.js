"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { TbX, TbCalendarTime, TbCreditCard, TbLock } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { calculateRental, formatCurrency, todayISO, unitOf } from "@/lib/utils";

export default function BookingModal({ item, user, onClose }) {
  const today = todayISO();
  const [form, setForm] = useState({
    startDate: today,
    endDate: today,
    quantity: 1,
    contactNumber: user?.phone || "",
    deliveryAddress: user?.address || "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const max = item.availableQuantity ?? 0;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const calc = useMemo(
    () =>
      calculateRental({
        rentalPrice: item.rentalPrice,
        rentalType: item.rentalType,
        startDate: form.startDate,
        endDate: form.endDate,
        quantity: form.quantity,
      }),
    [form.startDate, form.endDate, form.quantity, item.rentalPrice, item.rentalType]
  );

  const validate = () => {
    const e = {};
    if (!form.startDate) e.startDate = "Pick a start date";
    else if (form.startDate < today) e.startDate = "Start date can't be in the past";
    if (!form.endDate) e.endDate = "Pick an end date";
    else if (form.endDate < form.startDate) e.endDate = "End date must be after the start date";
    const q = Number(form.quantity);
    if (!Number.isInteger(q) || q < 1) e.quantity = "Quantity must be at least 1";
    else if (q > max) e.quantity = `Only ${max} unit(s) available`;
    if (!/^[+\d][\d\s-]{6,19}$/.test(form.contactNumber.trim())) e.contactNumber = "Enter a valid phone number";
    if (form.deliveryAddress.trim().length < 5) e.deliveryAddress = "Enter the delivery address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const payload = { equipmentId: item._id, ...form, quantity: Number(form.quantity) };
      // 1) server calculates total + checks availability
      const { data: quote } = await api.post("/payments/quote", payload);

      const ok = await Swal.fire({
        title: "Confirm your rental",
        html: `
          <div style="text-align:left;font-size:15px;line-height:1.9">
            <b>${item.name}</b><br/>
            ${form.startDate} → ${form.endDate} (${quote.rentalDays} day${quote.rentalDays > 1 ? "s" : ""})<br/>
            ${quote.quantity} unit(s) × ${quote.billingUnits} ${unitOf(quote.rentalType)}(s) × ${formatCurrency(quote.rentalPrice)}<br/>
            <span style="font-size:22px;font-weight:800">Total: ${formatCurrency(quote.totalAmount)}</span>
          </div>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Proceed to secure payment",
        cancelButtonText: "Edit booking",
        confirmButtonColor: "#14213d",
        reverseButtons: true,
      });
      if (!ok.isConfirmed) return setBusy(false);

      // 2) create Stripe Checkout session and redirect
      const { data } = await api.post("/payments/checkout", payload);
      toast.loading("Redirecting to Stripe…");
      window.location.assign(data.url);
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  };

  const fieldError = (k) => errors[k] && <p className="mt-1 text-xs font-medium text-error">{errors[k]}</p>;

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <div className="modal-box max-w-2xl rounded-t-3xl p-0 sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
          <div>
            <h3 id="booking-title" className="text-xl font-extrabold">
              Book {item.name}
            </h3>
            <p className="text-sm text-base-content/60">
              {formatCurrency(item.rentalPrice)} / {unitOf(item.rentalType)} · {max} unit(s) available
            </p>
          </div>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose} aria-label="Close" disabled={busy}>
            <TbX />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4 px-6 py-5 sm:grid-cols-2" noValidate>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Rental start date</legend>
            <input type="date" className="input w-full" min={today} value={form.startDate} onChange={set("startDate")} required />
            {fieldError("startDate")}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Rental end date</legend>
            <input type="date" className="input w-full" min={form.startDate || today} value={form.endDate} onChange={set("endDate")} required />
            {fieldError("endDate")}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Required quantity</legend>
            <input type="number" className="input w-full" min={1} max={max} value={form.quantity} onChange={set("quantity")} required />
            {fieldError("quantity")}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Contact number</legend>
            <input type="tel" className="input w-full" placeholder="+8801XXXXXXXXX" value={form.contactNumber} onChange={set("contactNumber")} required />
            {fieldError("contactNumber")}
          </fieldset>
          <fieldset className="fieldset sm:col-span-2">
            <legend className="fieldset-legend">Delivery address</legend>
            <input className="input w-full" placeholder="House, road, area, city" value={form.deliveryAddress} onChange={set("deliveryAddress")} required />
            {fieldError("deliveryAddress")}
          </fieldset>
          <fieldset className="fieldset sm:col-span-2">
            <legend className="fieldset-legend">Additional notes (optional)</legend>
            <textarea className="textarea w-full" rows={2} maxLength={450} placeholder="Delivery time, site access, operator needed…" value={form.notes} onChange={set("notes")} />
          </fieldset>

          <div className="rounded-2xl bg-base-200 p-4 sm:col-span-2">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold">
              <TbCalendarTime className="text-accent" /> Price summary
            </p>
            {calc ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Duration</span>
                  <span>
                    {calc.rentalDays} day(s) → {calc.billingUnits} {unitOf(item.rentalType)}(s) billed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">
                    {formatCurrency(item.rentalPrice)} × {calc.billingUnits} × {calc.quantity} unit(s)
                  </span>
                  <span>{formatCurrency(calc.total)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-base-300 pt-2 text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-display text-2xl font-extrabold">{formatCurrency(calc.total)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-base-content/60">Select valid dates to see the total.</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn btn-ghost btn-pill" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-rig" disabled={busy || max < 1}>
              {busy ? <span className="loading loading-spinner loading-sm" /> : <TbCreditCard />}
              Confirm booking
            </button>
          </div>
          <p className="flex items-center justify-center gap-1 text-xs text-base-content/50 sm:col-span-2">
            <TbLock /> Payments are processed securely by Stripe. Test card: 4242 4242 4242 4242
          </p>
        </form>
      </div>
      <button className="modal-backdrop" onClick={() => !busy && onClose()} aria-label="Close booking" />
    </div>
  );
}
