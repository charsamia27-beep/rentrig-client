"use client";

import { useEffect, useState } from "react";
import { TbPhoto, TbUpload } from "react-icons/tb";
import toast from "react-hot-toast";
import { CATEGORY_NAMES, CONDITIONS, RENTAL_TYPES } from "@/lib/constants";
import { uploadToImgbb } from "@/lib/imgbb";
import { StatusBadge } from "./ui";

const EMPTY = {
  name: "",
  description: "",
  category: "",
  location: "",
  rentalPrice: "",
  rentalType: "daily",
  quantity: 1,
  condition: "Excellent",
  brand: "",
  model: "",
  image: "",
  terms: "• Valid NID/passport required on delivery.\n• Renter is responsible for damage beyond normal wear.\n• Late returns are charged at the daily rate.",
};

/**
 * Shared create / update form for equipment.
 * onSubmit receives the clean payload (image already uploaded to imgbb).
 */
export default function EquipmentForm({ initial, owner, onSubmit, submitLabel = "Submit for approval", showStatus = true }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial || {}) }));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (String(form.name || "").trim().length < 3) e.name = "Name must be at least 3 characters";
    if (String(form.description || "").trim().length < 20) e.description = "Write at least 20 characters";
    if (!form.category) e.category = "Choose a category";
    if (!String(form.location || "").trim()) e.location = "Location is required";
    if (!(Number(form.rentalPrice) > 0)) e.rentalPrice = "Enter a price greater than 0";
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) e.quantity = "At least 1 unit";
    if (!file && !form.image) e.image = "Upload an equipment image";
    if (String(form.terms || "").trim().length < 10) e.terms = "Add your rental terms";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted fields");
    setBusy(true);
    try {
      let image = form.image;
      if (file) {
        const t = toast.loading("Uploading image to imgbb…");
        try {
          image = await uploadToImgbb(file);
        } finally {
          toast.dismiss(t);
        }
      }
      const payload = {
        name: String(form.name || "").trim(),
        description: String(form.description || "").trim(),
        category: form.category,
        location: String(form.location || "").trim(),
        rentalPrice: Number(form.rentalPrice),
        rentalType: form.rentalType,
        quantity: parseInt(form.quantity, 10),
        condition: form.condition,
        brand: String(form.brand || "").trim(),
        model: String(form.model || "").trim(),
        image,
        terms: String(form.terms || "").trim(),
      };
      const done = await onSubmit(payload);
      if (done === "reset") {
        setForm({ ...EMPTY });
        setFile(null);
        setPreview("");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Could not save equipment");
    } finally {
      setBusy(false);
    }
  };

  const err = (k) => errors[k] && <p className="mt-1 text-xs font-medium text-error">{errors[k]}</p>;

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="fieldset sm:col-span-2">
          <legend className="fieldset-legend">Equipment name *</legend>
          <input className="input w-full" placeholder="e.g. Sony A7 IV Camera Kit" value={form.name} onChange={set("name")} />
          {err("name")}
        </fieldset>
        <fieldset className="fieldset sm:col-span-2">
          <legend className="fieldset-legend">Description *</legend>
          <textarea className="textarea w-full" rows={4} placeholder="What's included, ideal uses, specs…" value={form.description} onChange={set("description")} />
          {err("description")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Category *</legend>
          <select className="select w-full" value={form.category} onChange={set("category")}>
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORY_NAMES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {err("category")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Location *</legend>
          <input className="input w-full" placeholder="Area, City" value={form.location} onChange={set("location")} />
          {err("location")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Rental price (USD) *</legend>
          <input type="number" min="1" step="0.01" className="input w-full" value={form.rentalPrice} onChange={set("rentalPrice")} />
          {err("rentalPrice")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Rental type *</legend>
          <select className="select w-full" value={form.rentalType} onChange={set("rentalType")}>
            {RENTAL_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label} (per {r.unit})
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Available quantity *</legend>
          <input type="number" min="1" className="input w-full" value={form.quantity} onChange={set("quantity")} />
          {err("quantity")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Equipment condition</legend>
          <select className="select w-full" value={form.condition} onChange={set("condition")}>
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Brand</legend>
          <input className="input w-full" placeholder="e.g. Sony" value={form.brand} onChange={set("brand")} />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Model</legend>
          <input className="input w-full" placeholder="e.g. ILCE-7M4" value={form.model} onChange={set("model")} />
        </fieldset>
        <fieldset className="fieldset sm:col-span-2">
          <legend className="fieldset-legend">Rental terms & conditions *</legend>
          <textarea className="textarea w-full" rows={4} value={form.terms} onChange={set("terms")} />
          {err("terms")}
        </fieldset>
      </div>

      <div className="space-y-4">
        <div>
          <p className="fieldset-legend mb-2 text-xs font-semibold">Equipment image * (uploaded to imgbb)</p>
          <label className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed ${errors.image ? "border-error" : "border-base-300"} bg-base-200 text-center hover:border-primary`}>
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <>
                <TbPhoto className="text-4xl text-base-content/40" />
                <span className="text-sm font-semibold">Click to upload</span>
                <span className="text-xs text-base-content/50">JPG / PNG up to 5MB</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {preview && (
            <p className="mt-2 flex items-center gap-1 text-xs text-base-content/60">
              <TbUpload /> {file ? file.name : "Current image"} – click the image to change it
            </p>
          )}
          {err("image")}
        </div>

        {showStatus && (
          <div className="rounded-2xl border border-base-300 p-4 text-sm">
            <p className="mb-1 font-semibold">Status</p>
            <StatusBadge type="equipment" value="pending" />
            <p className="mt-2 text-xs text-base-content/60">New and edited listings are reviewed by an admin before appearing publicly.</p>
          </div>
        )}

        {owner && (
          <div className="rounded-2xl border border-base-300 p-4 text-sm">
            <p className="mb-2 font-semibold">Owner information</p>
            <p>{owner.name}</p>
            <p className="text-base-content/60">{owner.email}</p>
          </div>
        )}

        <button className="btn btn-primary btn-rig h-12 w-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />} {submitLabel}
        </button>
      </div>
    </form>
  );
}
