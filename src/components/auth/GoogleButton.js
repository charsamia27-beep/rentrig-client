"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function GoogleButton({ redirect = "/", label = "Continue with Google" }) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const join = redirect.includes("?") ? "&" : "?";
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: `${redirect}${join}welcome=1`,
      errorCallbackURL: "/login?error=google",
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handle} disabled={loading} className="btn btn-outline btn-pill h-12 w-full gap-3 border-base-300 bg-base-100">
      {loading ? <span className="loading loading-spinner loading-sm" /> : <FcGoogle className="text-xl" />}
      {label}
    </button>
  );
}
