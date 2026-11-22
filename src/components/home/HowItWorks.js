"use client";

import { motion } from "framer-motion";
import { TbSearch, TbCalendarTime, TbCreditCard, TbTruckDelivery } from "react-icons/tb";

const steps = [
  { Icon: TbSearch, title: "Find your equipment", text: "Search by name or location and filter by category, rental type, price and availability." },
  { Icon: TbCalendarTime, title: "Pick your dates", text: "Choose start & end dates and quantity – the total is calculated instantly and availability is checked." },
  { Icon: TbCreditCard, title: "Pay securely", text: "Complete payment on Stripe Checkout. Your booking and receipt are created the moment it succeeds." },
  { Icon: TbTruckDelivery, title: "Get it delivered", text: "The owner delivers to your address. Track the rental status from your dashboard until it's completed." },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary py-16 text-secondary-content md:py-24">
      <div className="container-x">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="section-eyebrow text-primary!">
            <span className="h-[3px] w-6 rounded-full bg-primary" /> How it works
          </span>
          <h2 className="section-title mt-3 text-balance">From search to site in four simple steps</h2>
          <p className="mt-3 max-w-2xl text-secondary-content/70">No paperwork, no back-and-forth phone calls. Book equipment the way you book a ride.</p>
        </div>

        <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-secondary-content/20 lg:block" />
          {steps.map(({ Icon, title, text }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span className="grid h-[72px] w-[72px] place-items-center rounded-2xl bg-primary text-3xl text-primary-content shadow-lg">
                  <Icon />
                </span>
                <span className="font-display text-5xl font-extrabold text-secondary-content/15">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-content/70">{text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
