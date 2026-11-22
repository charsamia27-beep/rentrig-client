"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbArrowUpRight } from "react-icons/tb";
import SectionHeading from "@/components/shared/SectionHeading";
import CategoryIcon from "@/components/shared/CategoryIcon";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function CategoriesSection({ stats = [] }) {
  const byName = Object.fromEntries(stats.map((s) => [s.name, s]));

  return (
    <section className="bg-base-200/60 py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          center
          eyebrow="Popular categories"
          title="Whatever the job, there's a rig for it"
          sub="Six focused categories so you can find the right equipment in seconds."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => {
            const s = byName[c.name];
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(c.name)}`}
                  className="group card-surface relative flex h-full items-start gap-5 overflow-hidden p-6 hover:border-primary"
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-secondary text-3xl text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content">
                    <CategoryIcon category={c.name} />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{c.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-base-content/65">{c.blurb}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wider text-base-content/50">
                      {s?.count ?? 0} listings{s?.fromPrice ? ` · from ${formatCurrency(s.fromPrice)}` : ""}
                    </p>
                  </div>
                  <TbArrowUpRight className="text-xl text-base-content/30 transition group-hover:rotate-45 group-hover:text-primary" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
