"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TbCamera, TbMail, TbPhone, TbMapPin, TbCalendarTime, TbShieldCheck, TbEdit } from "react-icons/tb";
import api, { errorMessage, getAccessToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { uploadToImgbb } from "@/lib/imgbb";
import { formatDate } from "@/lib/utils";
import { ErrorBox, PageHeader, StatusBadge } from "@/components/dashboard/ui";

export default function ProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: session, refetch: refetchSession } = useSession();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", image: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const { data: me, isLoading, isError, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/users/me")).data,
  });

  useEffect(() => {
    if (me) setForm({ name: me.name || "", phone: me.phone || "", address: me.address || "", image: me.image || "" });
  }, [me]);

  useEffect(() => {
    if (!file) return setPreview("");
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const save = useMutation({
    mutationFn: async () => {
      let image = form.image;
      if (file) image = await uploadToImgbb(file);
      return (await api.patch("/users/me", { ...form, image })).data;
    },
    onSuccess: async (d) => {
      toast.success(d.message || "Profile updated");
      setEditing(false);
      setFile(null);
      qc.invalidateQueries({ queryKey: ["me"] });
      await refetchSession?.();
      await getAccessToken(true);
      router.refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (isError) return <ErrorBox onRetry={refetch} />;
  if (isLoading || !me) return <div className="skeleton h-96 rounded-3xl" />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const avatar = preview || form.image || `https://ui-avatars.com/api/?background=f59e0b&color=14213d&bold=true&size=256&name=${encodeURIComponent(me.name)}`;
  const createdAt = session?.user?.createdAt;

  return (
    <>
      <PageHeader title="My Profile" sub="Keep your contact details up to date – they pre-fill your bookings." />
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="card-surface overflow-hidden text-center">
          <div className="hazard-stripe h-20" />
          <div className="-mt-12 px-6 pb-6">
            <div className="relative mx-auto h-28 w-28">
              <img src={avatar} alt={me.name} referrerPolicy="no-referrer" className="h-28 w-28 rounded-3xl border-4 border-base-100 object-cover shadow-lg" />
              {editing && (
                <label className="btn btn-circle btn-sm btn-primary absolute -bottom-1 -right-1 cursor-pointer" title="Change photo">
                  <TbCamera />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
            <h2 className="mt-4 text-xl font-extrabold">{me.name}</h2>
            <p className="text-sm text-base-content/60">{me.email}</p>
            <div className="mt-3">
              <StatusBadge type="role" value={me.role} />
            </div>
            <ul className="mt-6 space-y-3 text-left text-sm">
              <li className="flex items-center gap-3">
                <TbMail className="text-lg text-accent" /> {me.email}
              </li>
              <li className="flex items-center gap-3">
                <TbPhone className="text-lg text-accent" /> {me.phone || <span className="text-base-content/40">No phone added</span>}
              </li>
              <li className="flex items-center gap-3">
                <TbMapPin className="text-lg text-accent" /> {me.address || <span className="text-base-content/40">No address added</span>}
              </li>
              {createdAt && (
                <li className="flex items-center gap-3">
                  <TbCalendarTime className="text-lg text-accent" /> Member since {formatDate(createdAt)}
                </li>
              )}
              <li className="flex items-center gap-3">
                <TbShieldCheck className="text-lg text-accent" /> Secured with JWT & Better Auth
              </li>
            </ul>
          </div>
        </div>

        <div className="card-surface p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold">Profile information</h3>
            {!editing && (
              <button className="btn btn-secondary btn-sm rounded-full" onClick={() => setEditing(true)}>
                <TbEdit /> Edit profile
              </button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters");
              save.mutate();
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Name</legend>
              <input className="input w-full" value={form.name} onChange={set("name")} disabled={!editing} />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email (cannot be changed)</legend>
              <input className="input w-full" value={me.email} disabled />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Phone number</legend>
              <input className="input w-full" placeholder="+8801XXXXXXXXX" value={form.phone} onChange={set("phone")} disabled={!editing} />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Profile image URL</legend>
              <input className="input w-full" placeholder="https://…" value={form.image} onChange={set("image")} disabled={!editing || Boolean(file)} />
            </fieldset>
            <fieldset className="fieldset sm:col-span-2">
              <legend className="fieldset-legend">Address</legend>
              <textarea className="textarea w-full" rows={3} placeholder="House, road, area, city" value={form.address} onChange={set("address")} disabled={!editing} />
            </fieldset>
            {editing && (
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-pill"
                  onClick={() => {
                    setEditing(false);
                    setFile(null);
                    setForm({ name: me.name || "", phone: me.phone || "", address: me.address || "", image: me.image || "" });
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary btn-rig" disabled={save.isPending}>
                  {save.isPending && <span className="loading loading-spinner loading-sm" />} Save changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
