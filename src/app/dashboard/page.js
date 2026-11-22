import { requireUser } from "@/lib/session";
import CustomerOverview from "@/components/dashboard/overview/CustomerOverview";

export const metadata = { title: "Overview" };

export default async function DashboardHome() {
  const user = await requireUser("/dashboard");
  return <CustomerOverview name={user.name} />;
}
