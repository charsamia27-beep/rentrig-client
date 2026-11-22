"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  TbLayoutDashboard,
  TbClipboardList,
  TbHeart,
  TbReceipt,
  TbUser,
  TbPlus,
  TbPackage,
  TbTruck,
  TbUsers,
  TbBuildingWarehouse,
  TbChartBar,
  TbHome,
  TbLogout,
  TbMenu2,
  TbX,
} from "react-icons/tb";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { signOut } from "@/lib/auth-client";
import { clearAccessToken } from "@/lib/api";
import { ROLE_STYLES } from "@/lib/constants";

const NAV = {
  customer: [
    { href: "/dashboard", label: "Overview", Icon: TbLayoutDashboard },
    { href: "/dashboard/my-rentals", label: "My Rentals", Icon: TbClipboardList },
    { href: "/dashboard/favorites", label: "Favorites", Icon: TbHeart },
    { href: "/dashboard/payments", label: "Payment History", Icon: TbReceipt },
    { href: "/dashboard/profile", label: "Profile", Icon: TbUser },
  ],
  owner: [
    { href: "/dashboard", label: "Analytics", Icon: TbChartBar },
    { href: "/dashboard/add-equipment", label: "Add Equipment", Icon: TbPlus },
    { href: "/dashboard/my-equipment", label: "My Equipment", Icon: TbPackage },
    { href: "/dashboard/equipment-rentals", label: "My Equipment Rental", Icon: TbTruck },
    { href: "/dashboard/profile", label: "My Profile", Icon: TbUser },
  ],
  admin: [
    { href: "/dashboard", label: "Analytics", Icon: TbChartBar },
    { href: "/dashboard/all-users", label: "All Users", Icon: TbUsers },
    { href: "/dashboard/all-equipment", label: "All Equipment", Icon: TbBuildingWarehouse },
    { href: "/dashboard/all-rentals", label: "All Rentals", Icon: TbClipboardList },
    { href: "/dashboard/profile", label: "My Profile", Icon: TbUser },
  ],
};

const DashboardUserContext = createContext(null);
export const useDashboardUser = () => useContext(DashboardUserContext);

export default function DashboardShell({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const role = user?.role || "customer";
  const links = NAV[role] || NAV.customer;
  const current = links.find((l) => (l.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(l.href)));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("denied")) {
      toast.error("You don't have permission to open that page.");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  const logout = async () => {
    await signOut();
    clearAccessToken();
    qc.clear();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  };

  const avatar = user?.image || `https://ui-avatars.com/api/?background=f59e0b&color=14213d&bold=true&name=${encodeURIComponent(user?.name || "U")}`;

  const Sidebar = (
    <aside className="flex h-full w-72 flex-col bg-neutral text-neutral-content">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="rounded-xl bg-base-100 px-2 py-1">
          <Logo />
        </div>
        <button className="btn btn-ghost btn-circle btn-sm lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar">
          <TbX />
        </button>
      </div>

      <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-neutral-content/10 p-3">
        <img src={avatar} alt={user?.name} className="h-11 w-11 rounded-xl object-cover" referrerPolicy="no-referrer" />
        <div className="min-w-0">
          <p className="truncate font-bold">{user?.name}</p>
          <span className={`badge badge-sm capitalize ${ROLE_STYLES[role]}`}>{role}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] opacity-50">Menu</p>
        <ul className="space-y-1">
          {links.map(({ href, label, Icon }) => {
            const active = current?.href === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold transition ${
                    active ? "bg-primary text-primary-content shadow" : "opacity-80 hover:bg-neutral-content/10 hover:opacity-100"
                  }`}
                >
                  <Icon className="text-xl" /> {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-1 border-t border-neutral-content/10 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold opacity-80 hover:bg-neutral-content/10 hover:opacity-100">
          <TbHome className="text-xl" /> Back to website
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-error hover:bg-neutral-content/10">
          <TbLogout className="text-xl" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <DashboardUserContext.Provider value={user}>
      <div className="flex min-h-screen bg-base-200/60">
        <div className="no-print sticky top-0 hidden h-screen lg:block">{Sidebar}</div>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Close menu" />
            <div className="relative h-full">{Sidebar}</div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-circle btn-sm lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                <TbMenu2 className="text-xl" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50 capitalize">{role} dashboard</p>
                <p className="font-display text-lg font-bold leading-tight">{current?.label || "Dashboard"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/dashboard/profile" aria-label="Profile">
                <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/50" referrerPolicy="no-referrer" />
              </Link>
            </div>
          </header>
          <main className="w-full flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </DashboardUserContext.Provider>
  );
}
