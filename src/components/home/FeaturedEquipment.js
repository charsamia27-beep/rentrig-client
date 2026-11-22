"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbArrowRight, TbPackage } from "react-icons/tb";
import SectionHeading from "@/components/shared/SectionHeading";
import EquipmentCard from "@/components/equipment/EquipmentCard";

export default function FeaturedEquipment({ items = [] }) {
  return (
    <section className="container-x py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <SectionHeading
          eyebrow="Featured equipment"
          title="Top-rated gear, approved and ready to roll"
          sub="Hand-picked listings from verified owners. Every item is reviewed by our team before it goes live."
          action={
            <Link href="/equipment" className="btn btn-outline btn-pill self-start md:self-auto">
              View all equipment <TbArrowRight />
            </Link>
          }
        />
      </motion.div>

      {items.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <EquipmentCard key={item._id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="card-surface flex flex-col items-center gap-3 py-16 text-center">
          <TbPackage className="text-5xl text-base-content/30" />
          <p className="font-semibold">No featured equipment yet</p>
          <p className="text-sm text-base-content/60">Approved listings will appear here automatically.</p>
        </div>
      )}
    </section>
  );
}
