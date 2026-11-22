"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { HiBars3, HiXMark, HiOutlineSquares2X2, HiArrowRightOnRectangle, HiOutlineUserCircle } from "react-icons/hi2";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { signOut, useSession } from "@/lib/auth-client";
import { clearAccessToken, getAccessToken } from "@/lib/api";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Google sign-in returns to "?welcome=1" – greet once, mint an access token, clean the URL
  useEffect(() => {
    if (!user) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("welcome") === "1") {
      toast.success(`Welcome, ${user.name?.split(" ")[0] || "there"}! You're signed in.`);
      getAccessToken(true);
      url.searchParams.delete("welcome");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  }, [user]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    await signOut();
    clearAccessToken();
    queryClient.clear();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-base-300 bg-base-100/85 backdrop-blur-lg" : "bg-base-100"
      }`}
    >
      <nav className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive(l.href) ? "text-base-content" : "text-base-content/65 hover:text-base-content"
                }`}
              >
                {isActive(l.href) && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-base-200" transition={{ type: "spring", duration: 0.5 }} />
                )}
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <div className="skeleton h-10 w-28 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost h-11 gap-2 rounded-full border border-base-300 pl-1.5 pr-3" aria-label="Account menu">
                <img
                  src={user.image || `https://ui-avatars.com/api/?background=f59e0b&color=14213d&bold=true&name=${encodeURIComponent(user.name || "U")}`}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden max-w-[110px] truncate text-sm font-semibold sm:inline">{user.name?.split(" ")[0]}</span>
              </button>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
                <li className="menu-title">
                  <span className="truncate text-base-content">{user.name}</span>
                  <span className="truncate text-xs font-normal capitalize text-base-content/60">{user.role || "customer"} account</span>
                </li>
                <li>
                  <Link href="/dashboard">
                    <HiOutlineSquares2X2 /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile">
                    <HiOutlineUserCircle /> My Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <HiArrowRightOnRectangle /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost btn-pill">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-rig">
                Register
              </Link>
            </div>
          )}
          {user && (
            <Link href="/dashboard" className="btn btn-primary btn-rig hidden xl:inline-flex">
              Dashboard
            </Link>
          )}
          <button className="btn btn-ghost btn-circle lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
            {open ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-base-300 bg-base-100 lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-xl px-4 py-3 font-semibold ${isActive(l.href) ? "bg-base-200" : "hover:bg-base-200"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard" className="block rounded-xl px-4 py-3 font-semibold hover:bg-base-200">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="w-full rounded-xl px-4 py-3 text-left font-semibold text-error hover:bg-base-200">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="mt-2 grid grid-cols-2 gap-2">
                  <Link href="/login" className="btn btn-outline btn-pill">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-rig">
                    Register
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
