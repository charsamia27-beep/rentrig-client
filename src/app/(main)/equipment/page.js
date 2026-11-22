import { Suspense } from "react";
import AllEquipmentClient from "@/components/equipment/AllEquipmentClient";

export const metadata = {
  title: "All Equipment",
  description: "Browse approved rental equipment – search by name or location, filter by category, rental type, price and availability.",
};

export default function AllEquipmentPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-base-300 bg-base-200/60">
        <div className="bg-blueprint absolute inset-0 opacity-60" />
        <div className="container-x relative py-12 md:py-16">
          <span className="section-eyebrow">
            <span className="h-[3px] w-6 rounded-full bg-primary" /> Marketplace
          </span>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">All equipment</h1>
          <p className="section-sub">Every listing below is approved by our team. Filter, compare and book in a couple of clicks.</p>
        </div>
      </section>
      <Suspense fallback={<div className="container-x py-10"><div className="skeleton h-14 w-full rounded-full" /></div>}>
        <AllEquipmentClient />
      </Suspense>
    </>
  );
}
