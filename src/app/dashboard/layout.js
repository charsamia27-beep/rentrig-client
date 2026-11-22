import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/session";

export const metadata = { title: { default: "Dashboard", template: "%s | RentRig Dashboard" } };

// Every /dashboard route is private. The session is read on the server, so reloading any
// dashboard page keeps a signed-in user exactly where they are.
export default async function DashboardLayout({ children }) {
  const user = await requireUser("/dashboard");
  const safeUser = { id: user.id, name: user.name, email: user.email, image: user.image || "", role: user.role || "customer" };
  return <DashboardShell user={safeUser}>{children}</DashboardShell>;
}
