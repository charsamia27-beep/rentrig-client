"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlinePhoto, HiOutlineLink, HiCheck, HiXMark } from "react-icons/hi2";
import { signUp, useSession } from "@/lib/auth-client";
import { getAccessToken } from "@/lib/api";
import { uploadToImgbb } from "@/lib/imgbb";
import { safeRedirect } from "@/lib/utils";
import GoogleButton from "./GoogleButton";

const rules = [
  { test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p) => /[a-z]/.test(p), label: "One lowercase letter" },
  { test: (p) => p.length >= 6, label: "At least 6 characters" },
];

export const validatePassword = (p) => {
  if (!/[A-Z]/.test(p)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(p)) return "Password must contain at least one lowercase letter";
  if (p.length < 6) return "Password must be at least 6 characters long";
  return null;
};

const roles = [
  { value: "customer", title: "I want to rent", text: "Browse & book equipment" },
  { value: "owner", title: "I want to list", text: "Earn from my equipment" },
];

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect") || "/");
  const { data: session } = useSession();

  const [form, setForm] = useState({ name: "", email: "", photoUrl: "", password: "", role: "customer" });
  const [photoMode, setPhotoMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user && !loading) router.replace(redirect);
  }, [session, loading, redirect, router]);

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Please enter your full name");
    const passErr = validatePassword(form.password);
    if (passErr) {
      setError(passErr);
      toast.error(passErr);
      return;
    }

    setLoading(true);
    try {
      let image = form.photoUrl.trim();
      if (photoMode === "upload" && file) image = await uploadToImgbb(file);
      if (image && !/^https?:\/\//.test(image)) throw new Error("Photo must be a valid image URL");

      const { error: err } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        image: image || undefined,
        role: form.role,
      });
      if (err) throw new Error(err.message || "Registration failed");

      await getAccessToken(true);
      toast.success("Account created – welcome to RentRig!");
      router.replace(form.role === "owner" ? "/dashboard" : redirect);
      router.refresh();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((r) => (
          <label
            key={r.value}
            className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
              form.role === r.value ? "border-primary bg-primary/10" : "border-base-300 hover:border-base-content/30"
            }`}
          >
            <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set("role")} className="sr-only" />
            <p className="font-bold">{r.title}</p>
            <p className="text-xs text-base-content/60">{r.text}</p>
          </label>
        ))}
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Full name</legend>
        <input className="input w-full" placeholder="e.g. Samia Rahman" value={form.name} onChange={set("name")} required />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input type="email" className="input w-full" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend flex w-full justify-between">
          <span>Photo</span>
          <span className="join">
            <button type="button" onClick={() => setPhotoMode("upload")} className={`btn join-item btn-xs ${photoMode === "upload" ? "btn-secondary" : ""}`}>
              <HiOutlinePhoto /> Upload
            </button>
            <button type="button" onClick={() => setPhotoMode("url")} className={`btn join-item btn-xs ${photoMode === "url" ? "btn-secondary" : ""}`}>
              <HiOutlineLink /> Link
            </button>
          </span>
        </legend>
        {photoMode === "upload" ? (
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full bg-base-200">{preview ? <img src={preview} alt="preview" /> : null}</div>
            </div>
            <input type="file" accept="image/*" className="file-input w-full" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        ) : (
          <input className="input w-full" placeholder="https://i.ibb.co/your-photo.jpg" value={form.photoUrl} onChange={set("photoUrl")} />
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <label className="input w-full">
          <input type={showPass ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={set("password")} required />
          <button type="button" onClick={() => setShowPass((v) => !v)} aria-label="Toggle password visibility" className="text-lg opacity-60">
            {showPass ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
          </button>
        </label>
        <ul className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-3">
          {rules.map((r) => {
            const ok = r.test(form.password);
            return (
              <li key={r.label} className={`flex items-center gap-1 text-xs ${ok ? "text-success" : "text-base-content/50"}`}>
                {ok ? <HiCheck /> : <HiXMark />} {r.label}
              </li>
            );
          })}
        </ul>
      </fieldset>

      {error && <p className="rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">{error}</p>}

      <button type="submit" disabled={loading} className="btn btn-primary btn-rig h-12 w-full">
        {loading ? <span className="loading loading-spinner" /> : "Create account"}
      </button>

      <div className="divider text-xs text-base-content/50">OR</div>
      <GoogleButton redirect={redirect} label="Sign up with Google" />
      <p className="text-center text-xs text-base-content/50">Google sign-ups start as a customer account.</p>

      <p className="pt-2 text-center text-sm">
        Already have an account?{" "}
        <Link href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="link font-bold text-accent">
          Login
        </Link>
      </p>
    </form>
  );
}
