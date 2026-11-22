import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to book equipment, manage your listings or check your rentals."
      image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
    >
      <Suspense fallback={<div className="skeleton h-80 w-full" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
