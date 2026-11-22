import { HiCheckBadge } from "react-icons/hi2";

const points = ["Verified owners & inspected equipment", "Daily, weekly or monthly rates", "Secure Stripe checkout"];

export default function AuthShell({ title, subtitle, children, image }) {
  return (
    <section className="container-x py-10 md:py-16">
      <div className="card-surface grid overflow-hidden lg:grid-cols-2">
        <div className="relative hidden min-h-[620px] lg:block">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#14213d] via-[#14213d]/70 to-[#14213d]/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="section-eyebrow text-amber-400!">RentRig marketplace</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight">Everything you need for the job – without buying it.</h2>
            <ul className="mt-6 space-y-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-white/85">
                  <HiCheckBadge className="text-xl text-amber-400" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:p-14">
          <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
          <p className="mt-2 text-base-content/65">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
