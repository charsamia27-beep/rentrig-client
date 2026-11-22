import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Rent equipment in minutes or start earning from the gear you already own."
      image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
    >
      <Suspense fallback={<div className="skeleton h-96 w-full" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
