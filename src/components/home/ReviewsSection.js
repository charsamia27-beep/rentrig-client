"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaRegStar } from "react-icons/fa6";
import SectionHeading from "@/components/shared/SectionHeading";

const fallback = [
  { _id: "f1", customerName: "Nusrat Jahan", rating: 5, comment: "Booked a camera kit for a wedding – spotless gear and a super smooth payment.", equipmentName: "Sony A7 IV Camera Kit" },
  { _id: "f2", customerName: "Rakib Hasan", rating: 5, comment: "Needed an excavator on short notice and it was on site the next morning.", equipmentName: "Komatsu PC210 Excavator" },
  { _id: "f3", customerName: "Farhana Akter", rating: 4, comment: "The lighting package made our event look premium. Support was very helpful.", equipmentName: "Stage Lighting Package" },
  { _id: "f4", customerName: "Tanvir Ahmed", rating: 5, comment: "Weekly tractor rate was far cheaper than buying and the owner was verified.", equipmentName: "Mahindra 575 DI Tractor" },
];

export const Stars = ({ value = 0, className = "" }) => (
  <span className={`inline-flex gap-0.5 text-primary ${className}`} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(value) ? <FaStar key={n} /> : <FaRegStar key={n} />))}
  </span>
);

const avatar = (r) =>
  r.customerImage || `https://ui-avatars.com/api/?background=14213d&color=f59e0b&bold=true&name=${encodeURIComponent(r.customerName || "R")}`;

export default function ReviewsSection({ reviews = [] }) {
  const list = reviews.length >= 4 ? reviews : [...reviews, ...fallback].slice(0, Math.max(4, reviews.length));

  return (
    <section className="bg-base-200/60 py-16 md:py-24">
      <div className="container-x">
        <SectionHeading center eyebrow="Customer reviews" title="Trusted by people who get things done" sub="Real feedback from renters after their rentals were completed." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.slice(0, 8).map((r, i) => (
            <motion.figure
              key={r._id || i}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="card-surface flex h-full flex-col p-6"
            >
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                <FaQuoteLeft className="text-2xl text-base-content/10" />
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-base-content/80">“{r.comment}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-dashed border-base-300 pt-4">
                <img src={avatar(r)} alt={r.customerName} className="h-11 w-11 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div className="min-w-0">
                  <p className="truncate font-bold">{r.customerName}</p>
                  <p className="truncate text-xs text-base-content/55">Rented {r.equipmentName}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
