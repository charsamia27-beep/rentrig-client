"use client";

import { motion } from "framer-motion";
import { TbCash, TbShieldCheck, TbCalendarTime, TbCreditCard, TbHeadset, TbTruck } from "react-icons/tb";
import SectionHeading from "@/components/shared/SectionHeading";

const benefits = [
  { Icon: TbCash, title: "Affordable rental prices", text: "Pay only for the days you use. Daily, weekly and monthly rates are always shown up-front – no hidden fees." },
  { Icon: TbShieldCheck, title: "Verified equipment owners", text: "Every owner and listing is reviewed by an admin before it goes live, so what you see is what arrives." },
  { Icon: TbCalendarTime, title: "Flexible rental periods", text: "Pick exact start and end dates. Our pricing engine works out the best billing for your duration." },
  { Icon: TbCreditCard, title: "Secure payments", text: "Checkout runs on Stripe. Card details never touch our servers and every payment gets a receipt." },
  { Icon: TbTruck, title: "Delivered to your site", text: "Add your delivery address while booking and coordinate drop-off directly with the owner." },
  { Icon: TbHeadset, title: "Real human support", text: "Questions about a booking? Our team responds within hours, seven days a week." },
];

export default function WhyChooseUs() {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Why choose RentRig"
            title="Renting heavy-duty gear should feel lightweight"
            sub="We built RentRig for contractors, creators, farmers and event planners who need reliable equipment without the cost of owning it."
          />
          <div className="card-surface overflow-hidden">
            <div className="hazard-stripe h-2" />
            <div className="grid grid-cols-2 divide-x divide-base-300">
              <div className="p-5">
                <p className="font-display text-4xl font-extrabold">60%</p>
                <p className="text-sm text-base-content/60">average saving vs. buying</p>
              </div>
              <div className="p-5">
                <p className="font-display text-4xl font-extrabold">24h</p>
                <p className="text-sm text-base-content/60">typical time to delivery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: (i % 2) * 0.1 }}
              className="card-surface h-full p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-2xl text-primary">
                <Icon />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/65">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
