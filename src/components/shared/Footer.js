import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/constants";

const socials = [
  { href: "https://x.com", label: "X", Icon: FaXTwitter },
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebookF },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: FaLinkedinIn },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
];

export default function Footer() {
  return (
    <footer className="no-print mt-24 bg-neutral text-neutral-content">
      <div className="hazard-stripe h-2 w-full opacity-90" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-base-100 px-3 py-2 inline-block">
            <Logo />
          </div>
          <p className="mt-5 max-w-sm leading-relaxed text-neutral-content/70">
            The rental marketplace for serious equipment. Verified owners, transparent pricing and secure payments – from a single camera lens to a 21-ton excavator.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-neutral-content/20 transition hover:border-primary hover:bg-primary hover:text-primary-content"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Explore</h4>
          <ul className="space-y-2.5 text-neutral-content/75">
            <li><Link className="hover:text-primary" href="/equipment">All Equipment</Link></li>
            <li><Link className="hover:text-primary" href="/how-it-works">How it Works</Link></li>
            <li><Link className="hover:text-primary" href="/about">About Us</Link></li>
            <li><Link className="hover:text-primary" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-primary" href="/register">List your equipment</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Categories</h4>
          <ul className="space-y-2.5 text-neutral-content/75">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <Link className="hover:text-primary" href={`/equipment?category=${encodeURIComponent(c.name)}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Get in touch</h4>
          <ul className="space-y-3 text-neutral-content/75">
            <li className="flex gap-3"><HiOutlineMapPin className="mt-1 shrink-0 text-primary" /> House 12, Road 7, Mirpur DOHS, Dhaka 1216</li>
            <li className="flex gap-3"><HiOutlinePhone className="mt-1 shrink-0 text-primary" /> +880 1700-000000</li>
            <li className="flex gap-3"><HiOutlineEnvelope className="mt-1 shrink-0 text-primary" /> support@rentrig.app</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-content/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm text-neutral-content/60 md:flex-row">
          <p>© {new Date().getFullYear()} RentRig. All rights reserved.</p>
          <p>Payments secured by Stripe · Built with Next.js & Express</p>
        </div>
      </div>
    </footer>
  );
}
