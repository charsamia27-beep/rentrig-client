import Link from "next/link";
import { TbTarget, TbShieldCheck, TbLeaf, TbUsers, TbArrowRight } from "react-icons/tb";
import { serverGet } from "@/lib/server-api";

export const metadata = { title: "About us", description: "Why we built RentRig – a transparent, secure marketplace for renting equipment." };

const values = [
  { Icon: TbTarget, title: "Access over ownership", text: "Most equipment sits idle 80% of the time. Renting puts it to work and saves people money." },
  { Icon: TbShieldCheck, title: "Trust by design", text: "Admin-reviewed listings, role-based access, JWT-secured APIs and Stripe payments." },
  { Icon: TbLeaf, title: "Less waste", text: "Sharing equipment means fewer machines manufactured, shipped and thrown away." },
  { Icon: TbUsers, title: "Built for locals", text: "Small contractors, creators, farmers and event planners are the heart of RentRig." },
];

export default async function AboutPage() {
  const stats = await serverGet("/stats", {});
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-blueprint absolute inset-0 opacity-60" />
        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="section-eyebrow">
              <span className="h-[3px] w-6 rounded-full bg-primary" /> About RentRig
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl text-balance">We make serious equipment easy to rent.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-base-content/70">
              RentRig started with a simple frustration: finding a reliable excavator, camera kit or generator for a few days meant endless phone calls and
              cash deposits. We built one transparent marketplace where owners list, renters book, and payments just work.
            </p>
            <Link href="/equipment" className="btn btn-primary btn-rig mt-8">
              Explore the marketplace <TbArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Approved listings", stats?.listed ?? 0],
              ["Verified owners", stats?.owners ?? 0],
              ["Rentals completed", stats?.rentals ?? 0],
              ["Average rating", stats?.avgRating || "4.9"],
            ].map(([k, v], i) => (
              <div key={k} className={`card-surface p-6 ${i % 2 ? "translate-y-6" : ""}`}>
                <p className="font-display text-5xl font-extrabold">{v}</p>
                <p className="mt-1 text-sm text-base-content/60">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <h2 className="section-title mb-10 text-center">What we stand for</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, title, text }) => (
            <div key={title} className="card-surface h-full p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-2xl text-primary">
                <Icon />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/65">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
