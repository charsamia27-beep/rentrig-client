import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";

export const metadata = { title: "How it works" };

const faqs = [
  ["How is the rental price calculated?", "Daily items are billed per day, weekly items per started week (7 days) and monthly items per started month (30 days), multiplied by the quantity. Start and end dates are inclusive."],
  ["When is my booking created?", "Right after Stripe confirms your payment. You'll be redirected to a receipt page and the booking appears in My Rentals with payment status Paid."],
  ["Can I cancel?", "Yes – a confirmed booking can be cancelled from your dashboard before the start date. Owners and admins can also cancel; refunds are processed manually."],
  ["How do I list my equipment?", "Register as an Owner, open Dashboard → Add Equipment and submit the form. An admin reviews it and once approved it appears on the marketplace."],
  ["What happens when the rental ends?", "A scheduled job marks rentals completed after their end date, returns the units to stock and emails both renter and owner. You can then leave a review."],
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="container-x py-14 text-center">
        <span className="section-eyebrow justify-center">Guide</span>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">How RentRig works</h1>
        <p className="section-sub mx-auto">A transparent rental flow for renters and equipment owners.</p>
      </section>
      <HowItWorks />
      <section className="container-x py-16">
        <h2 className="section-title mb-8 text-center">Frequently asked questions</h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map(([q, a], i) => (
            <details key={q} className="collapse collapse-arrow card-surface" open={i === 0}>
              <summary className="collapse-title text-lg font-bold">{q}</summary>
              <div className="collapse-content leading-relaxed text-base-content/70">{a}</div>
            </details>
          ))}
        </div>
      </section>
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
