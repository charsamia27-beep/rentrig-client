import { requireUser } from "@/lib/session";
import AdminOverview from "@/components/dashboard/overview/AdminOverview";
import OwnerOverview from "@/components/dashboard/overview/OwnerOverview";
import CustomerOverview from "@/components/dashboard/overview/CustomerOverview";

export const metadata = { title: "Overview" };

export default async function DashboardHome() {
  const user = await requireUser("/dashboard");
  const role = user.role || "customer";
  if (role === "admin") return <AdminOverview />;
  if (role === "owner") return <OwnerOverview name={user.name} />;
  return <CustomerOverview name={user.name} />;
}
