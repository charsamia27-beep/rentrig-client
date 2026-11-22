import { requireRole } from "@/lib/session";

export default async function OwnerLayout({ children }) {
  await requireRole(["owner"]);
  return children;
}
