"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { TbSearch, TbShieldCheck, TbStarFilled, TbArrowRight, TbMapPin } from "react-icons/tb";
import { CATEGORIES } from "@/lib/constants";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

const HERO_IMG = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80";

export default function HeroBanner({ stats }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search.trim()) qs.set("search", search.trim());
    if (category) qs.set("category", category);
    router.push(`/equipment${qs.toString() ? `?${qs}` : ""}`);
  };

  const numbers = [
    { label: "Listed items", value: stats?.listed ?? 0, suffix: "+" },
    { label: "Verified owners", value: stats?.owners ?? 0, suffix: "+" },
    { label: "Rentals done", value: stats?.rentals ?? 0, suffix: "" },
    { label: "Avg. rating", value: stats?.avgRating || 4.9, suffix: "★" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_30%,transparent_75%)]" />
      <div className="container-x relative grid items-center gap-12 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span variants={item} className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Equipment rental marketplace · 6 categories
          </motion.span>

          <motion.h1 variants={item} className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl xl:text-7xl text-balance">
            Rent the{" "}
            <span className="relative inline-block">
              <span className="relative z-10">right rig</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                className="absolute inset-x-0 bottom-1 z-0 h-4 origin-left -rotate-1 rounded-sm bg-primary/70 md:h-5"
              />
            </span>
            , right on time.
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-base-content/70">
            From cinema cameras to 21-ton excavators – book verified equipment by the day, week or month, pay securely with Stripe and get it delivered to
            your site.
          </motion.p>

          <motion.form variants={item} onSubmit={onSearch} className="mt-8 flex flex-col gap-2 rounded-3xl border border-base-300 bg-base-100 p-2 shadow-xl shadow-base-content/5 sm:flex-row sm:rounded-full">
            <label className="flex flex-1 items-center gap-2 px-4">
              <TbSearch className="shrink-0 text-xl text-base-content/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search excavator, camera, projector…"
                className="h-12 w-full bg-transparent outline-none placeholder:text-base-content/40"
                aria-label="Search equipment"
              />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-ghost h-12 rounded-full border-0 sm:w-48 focus:outline-none"
              aria-label="Category"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.short}
                </option>
              ))}
            </select>
            <button className="btn btn-primary btn-rig h-12">
              Find gear <TbArrowRight />
            </button>
          </motion.form>

          <motion.dl variants={item} className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="border-l-2 border-primary pl-3">
                <dt className="text-xs font-semibold uppercase tracking-wider text-base-content/50">{n.label}</dt>
                <dd className="font-display text-3xl font-extrabold">
                  {n.value}
                  <span className="text-primary">{n.suffix}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: 1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="hazard-stripe absolute -right-4 -top-4 h-24 w-24 rounded-3xl opacity-90" />
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-base-100 bg-secondary shadow-2xl">
            <img src={HERO_IMG} alt="Engineer inspecting rental equipment" className="aspect-[4/5] w-full object-cover sm:aspect-[5/5]" />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute -left-2 bottom-10 w-64 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:-left-10"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">Sony A7 IV kit</p>
              <span className="badge badge-success badge-sm font-bold">Available</span>
            </div>
            <p className="mt-1 font-display text-2xl font-extrabold">
              $45<span className="text-sm font-semibold text-base-content/50">/day</span>
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-base-content/60">
              <TbMapPin /> Gulshan, Dhaka
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="absolute -right-2 top-14 flex items-center gap-3 rounded-2xl bg-secondary p-3 pr-5 text-secondary-content shadow-xl sm:-right-8"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-xl text-primary-content">
              <TbShieldCheck />
            </span>
            <div>
              <p className="text-sm font-bold">Verified owners</p>
              <p className="flex items-center gap-1 text-xs opacity-75">
                <TbStarFilled className="text-primary" /> 4.9 average rating
              </p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-5 right-8 hidden rounded-full bg-base-100 px-4 py-2 text-sm font-bold shadow-lg sm:block"
          >
            <Link href="/equipment" className="flex items-center gap-2">
              Browse all equipment <TbArrowRight />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
