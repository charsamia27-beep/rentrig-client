"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbCircleCheck, TbStarFilled, TbArrowRight } from "react-icons/tb";
import SectionHeading from "@/components/shared/SectionHeading";

export default function TrustedOwners({ owners = [] }) {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHeading
            eyebrow="Trusted equipment owners"
            title="Turn idle equipment into steady income"
            sub="Owners on RentRig list for free, set their own rates and get paid securely for every rental. Our admins verify each listing to keep quality high."
          />
          <ul className="space-y-3">
            {["List equipment in under 3 minutes", "Track bookings & earnings with live analytics", "Get paid through Stripe – no chasing payments"].map((t) => (
              <li key={t} className="flex items-center gap-3 font-medium">
                <TbCircleCheck className="text-xl text-accent" /> {t}
              </li>
            ))}
          </ul>
          <Link href="/register" className="btn btn-primary btn-rig mt-8">
            Become an owner <TbArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(owners.length ? owners : [{ name: "Your business here", listings: 0, rentals: 0, categories: [] }]).map((o, i) => (
            <motion.div
              key={o.name + i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-surface p-5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={o.image || `https://ui-avatars.com/api/?background=0f766e&color=fff&bold=true&name=${encodeURIComponent(o.name)}`}
                  alt={o.name}
                  className="h-12 w-12 rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 truncate font-bold">
                    {o.name} <TbCircleCheck className="shrink-0 text-accent" title="Verified" />
                  </p>
                  <p className="truncate text-xs text-base-content/55">{o.categories?.slice(0, 2).join(" · ") || "Verified owner"}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-base-200 p-3 text-center">
                <div>
                  <dt className="text-[11px] uppercase text-base-content/50">Listings</dt>
                  <dd className="font-display text-lg font-extrabold">{o.listings}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-base-content/50">Rentals</dt>
                  <dd className="font-display text-lg font-extrabold">{o.rentals}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase text-base-content/50">Rating</dt>
                  <dd className="inline-flex items-center gap-1 font-display text-lg font-extrabold">
                    {o.rating ? Number(o.rating).toFixed(1) : "–"} <TbStarFilled className="text-sm text-primary" />
                  </dd>
                </div>
              </dl>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
