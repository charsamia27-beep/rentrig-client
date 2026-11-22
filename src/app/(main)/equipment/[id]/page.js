import { notFound } from "next/navigation";
import EquipmentDetailsClient from "@/components/equipment/EquipmentDetailsClient";
import { requireUser } from "@/lib/session";
import { serverGet } from "@/lib/server-api";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await serverGet(`/equipment/${id}`, null);
  return { title: item?.name || "Equipment details", description: item?.description?.slice(0, 150) };
}

// Private route – the session is checked on the server so a hard reload never bounces a signed-in user to /login
export default async function EquipmentDetailsPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requireUser(`/equipment/${id}`);

  const item = await serverGet(`/equipment/${id}`, null);
  if (!item) notFound();

  // pending / rejected listings are only visible to their owner and admins
  if (item.status !== "approved" && user.role !== "admin" && user.email !== item.ownerEmail) notFound();

  const [reviews, similarRes] = await Promise.all([
    serverGet(`/reviews/equipment/${id}`, []),
    serverGet(`/equipment?category=${encodeURIComponent(item.category)}&limit=4`, { items: [] }),
  ]);
  const similar = (similarRes?.items || []).filter((s) => s._id !== item._id).slice(0, 3);

  const safeUser = { name: user.name, email: user.email, role: user.role || "customer", phone: user.phone || "", address: user.address || "" };

  return (
    <EquipmentDetailsClient
      item={item}
      user={safeUser}
      reviews={reviews}
      similar={similar}
      paymentCancelled={sp?.payment === "cancelled"}
    />
  );
}
