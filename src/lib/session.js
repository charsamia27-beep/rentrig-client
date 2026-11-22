import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/** Reads the Better Auth session on the server (works on hard reloads – no flash/redirect to login). */
export async function getServerSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

export async function requireUser(returnTo = "/") {
  const session = await getServerSession();
  if (!session?.user) redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  return session.user;
}

export async function requireRole(roles, returnTo = "/dashboard") {
  const user = await requireUser(returnTo);
  if (!roles.includes(user.role || "customer")) redirect("/dashboard?denied=1");
  return user;
}
