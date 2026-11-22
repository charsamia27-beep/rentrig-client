"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { TbArrowRight } from "react-icons/tb";
import SectionHeading from "@/components/shared/SectionHeading";
import EquipmentCard from "@/components/equipment/EquipmentCard";

export default function RecentlyAdded({ recent = [], popular = [] }) {
  const [tab, setTab] = useState("recent");
  const items = tab === "recent" ? recent : popular;
  if (!recent.length && !popular.length) return null;

  return (
    <section className="container-x py-16 md:py-24">
      <SectionHeading
        eyebrow="Fresh on RentRig"
        title={tab === "recent" ? "Recently added equipment" : "Most popular right now"}
        sub="New listings land every day. Switch tabs to see what renters are booking the most."
        action={
          <div role="tablist" className="tabs tabs-box self-start rounded-full md:self-auto">
            <button role="tab" onClick={() => setTab("recent")} className={`tab rounded-full font-semibold ${tab === "recent" ? "tab-active" : ""}`}>
              Recently added
            </button>
            <button role="tab" onClick={() => setTab("popular")} className={`tab rounded-full font-semibold ${tab === "popular" ? "tab-active" : ""}`}>
              Popular
            </button>
          </div>
        }
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item) => (
            <EquipmentCard key={item._id} item={item} animate={false} />
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-10 text-center">
        <Link href={`/equipment?sort=${tab === "recent" ? "newest" : "popular"}`} className="btn btn-secondary btn-pill">
          Explore more <TbArrowRight />
        </Link>
      </div>
    </section>
  );
}
