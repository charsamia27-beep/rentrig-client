"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { TbMail, TbPhone, TbMapPin, TbClock, TbSend } from "react-icons/tb";
import { errorMessage, publicApi } from "@/lib/api";

const info = [
  { Icon: TbMapPin, label: "Office", value: "House 12, Road 7, Mirpur DOHS, Dhaka 1216" },
  { Icon: TbPhone, label: "Phone", value: "+880 1700-000000" },
  { Icon: TbMail, label: "Email", value: "support@rentrig.app" },
  { Icon: TbClock, label: "Support hours", value: "Every day, 9:00 AM – 10:00 PM" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await publicApi.post("/messages", form);
      toast.success(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-x py-14 md:py-20">
      <div className="mb-12 text-center">
        <span className="section-eyebrow justify-center">Contact us</span>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">We&apos;re here to help</h1>
        <p className="section-sub mx-auto">Questions about a booking, listing your equipment or partnering with RentRig? Send us a message.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {info.map(({ Icon, label, value }) => (
            <div key={label} className="card-surface flex items-start gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-2xl text-primary">
                <Icon />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="card-surface grid gap-4 p-6 sm:grid-cols-2 md:p-8">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Your name</legend>
            <input className="input w-full" required minLength={2} value={form.name} onChange={set("name")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="email" className="input w-full" required value={form.email} onChange={set("email")} />
          </fieldset>
          <fieldset className="fieldset sm:col-span-2">
            <legend className="fieldset-legend">Subject</legend>
            <input className="input w-full" value={form.subject} onChange={set("subject")} />
          </fieldset>
          <fieldset className="fieldset sm:col-span-2">
            <legend className="fieldset-legend">Message</legend>
            <textarea className="textarea w-full" rows={6} required minLength={10} value={form.message} onChange={set("message")} />
          </fieldset>
          <div className="sm:col-span-2">
            <button className="btn btn-primary btn-rig h-12" disabled={busy}>
              {busy ? <span className="loading loading-spinner loading-sm" /> : <TbSend />} Send message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
