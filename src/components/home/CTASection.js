"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbArrowRight } from "react-icons/tb";

export default function CTASection() {
  return (
    <section className="container-x pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-primary-content md:px-14"
      >
        <div className="bg-blueprint absolute inset-0 opacity-40" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl text-balance">Got a project this week? Your equipment is one click away.</h2>
            <p className="mt-3 max-w-xl font-medium opacity-80">Create a free account and book in minutes – or list your own equipment and start earning.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/equipment" className="btn btn-secondary btn-pill h-12">
              Browse equipment <TbArrowRight />
            </Link>
            <Link href="/register" className="btn btn-pill h-12 border-2 border-primary-content bg-transparent text-primary-content hover:bg-primary-content hover:text-primary">
              List your gear
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
