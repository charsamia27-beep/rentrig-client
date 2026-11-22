import PaymentSuccessClient from "@/components/equipment/PaymentSuccessClient";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Payment successful" };

export default async function PaymentSuccessPage({ searchParams }) {
  const sp = await searchParams;
  const sessionId = typeof sp?.session_id === "string" ? sp.session_id : "";
  await requireUser(`/payment/success${sessionId ? `?session_id=${sessionId}` : ""}`);

  return (
    <section className="container-x py-14">
      <PaymentSuccessClient sessionId={sessionId} />
    </section>
  );
}
