"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { signIn, useSession } from "@/lib/auth-client";
import { getAccessToken } from "@/lib/api";
import { safeRedirect } from "@/lib/utils";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect") || "/");
  const { data: session } = useSession();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.get("error")) toast.error("Google sign-in was cancelled or failed. Please try again.");
  }, [params]);

  useEffect(() => {
    if (session?.user && !loading) router.replace(redirect);
  }, [session, loading, redirect, router]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required");
    setLoading(true);
    const { data, error: err } = await signIn.email({ email: form.email.trim().toLowerCase(), password: form.password });
    if (err) {
      const msg = err.status === 401 || err.code === "INVALID_EMAIL_OR_PASSWORD" ? "Invalid email or password" : err.message || "Login failed";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }
    await getAccessToken(true); // generate the JWT access token for the API
    Swal.fire({
      icon: "success",
      title: `Welcome back, ${data?.user?.name?.split(" ")[0] || ""}!`,
      text: "You have logged in successfully.",
      timer: 1600,
      showConfirmButton: false,
    });
    router.replace(redirect);
    router.refresh();
  };

  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input type="email" className="input w-full" placeholder="you@example.com" value={form.email} onChange={set("email")} autoComplete="email" required />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <label className="input w-full">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Your password"
            value={form.password}
            onChange={set("password")}
            autoComplete="current-password"
            required
          />
          <button type="button" onClick={() => setShowPass((v) => !v)} aria-label="Toggle password visibility" className="text-lg opacity-60">
            {showPass ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
          </button>
        </label>
      </fieldset>

      {error && <p className="rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">{error}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary btn-rig h-12 w-full">
        {loading ? <span className="loading loading-spinner" /> : "Login"}
      </button>

      <div className="divider text-xs text-base-content/50">OR</div>
      <GoogleButton redirect={redirect} />

      {process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL && (
        <div className="rounded-2xl border border-dashed border-base-300 p-3 text-sm">
          <p className="mb-2 font-semibold text-base-content/70">Quick demo login</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-xs btn-secondary"
              onClick={() => fillDemo(process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL, process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "")}
            >
              Admin
            </button>
            {process.env.NEXT_PUBLIC_DEMO_OWNER_EMAIL && (
              <button
                type="button"
                className="btn btn-xs btn-accent"
                onClick={() => fillDemo(process.env.NEXT_PUBLIC_DEMO_OWNER_EMAIL, process.env.NEXT_PUBLIC_DEMO_OWNER_PASSWORD || "")}
              >
                Owner
              </button>
            )}
            {process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL && (
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => fillDemo(process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL, process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD || "")}
              >
                Customer
              </button>
            )}
          </div>
        </div>
      )}

      <p className="pt-2 text-center text-sm">
        New to RentRig?{" "}
        <Link href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="link font-bold text-accent">
          Create an account
        </Link>
      </p>
    </form>
  );
}
