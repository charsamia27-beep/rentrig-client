"use client";

import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { TbBan, TbSearch, TbTrash, TbUserCheck } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { escapeHtml, formatDate } from "@/lib/utils";
import Pagination from "@/components/shared/Pagination";
import { useDashboardUser } from "@/components/dashboard/DashboardShell";
import { Avatar, EmptyState, ErrorBox, PageHeader, StatusBadge, TableCard, TableSkeleton } from "@/components/dashboard/ui";

const ROLES = ["customer", "owner", "admin"];

export default function AllUsersPage() {
  const me = useDashboardUser();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-users", page, role, term],
    queryFn: async () => (await api.get("/admin/users", { params: { page, limit: 10, role, search: term } })).data,
    placeholderData: keepPreviousData,
  });

  const onDone = (d) => {
    toast.success(d.message);
    qc.invalidateQueries({ queryKey: ["admin-users"] });
    qc.invalidateQueries({ queryKey: ["analytics"] });
  };
  const onErr = (e) => toast.error(errorMessage(e));

  const roleM = useMutation({ mutationFn: async ({ id, role }) => (await api.patch(`/admin/users/${id}/role`, { role })).data, onSuccess: onDone, onError: onErr });
  const banM = useMutation({ mutationFn: async ({ id, banned }) => (await api.patch(`/admin/users/${id}/status`, { banned })).data, onSuccess: onDone, onError: onErr });
  const delM = useMutation({ mutationFn: async (id) => (await api.delete(`/admin/users/${id}`)).data, onSuccess: onDone, onError: onErr });

  const changeRole = async (u, next) => {
    if (next === u.role) return;
    const r = await Swal.fire({
      title: "Change role?",
      html: `Make <b>${escapeHtml(u.name)}</b> ${next === "admin" ? "an" : "a"} <b>${next}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Change role",
      confirmButtonColor: "#14213d",
    });
    if (r.isConfirmed) roleM.mutate({ id: u._id, role: next });
  };

  const toggleBan = async (u) => {
    const r = await Swal.fire({
      title: u.banned ? `Restore ${u.name}?` : `Suspend ${u.name}?`,
      text: u.banned ? "They will be able to log in again." : "They will be signed out and blocked from the API.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: u.banned ? "Restore" : "Suspend",
      confirmButtonColor: u.banned ? "#15803d" : "#d97706",
    });
    if (r.isConfirmed) banM.mutate({ id: u._id, banned: !u.banned });
  };

  const remove = async (u) => {
    const r = await Swal.fire({
      title: `Delete ${u.name}?`,
      text: "Their account, sessions and favorites will be removed. This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete user",
      confirmButtonColor: "#dc2626",
    });
    if (r.isConfirmed) delM.mutate(u._id);
  };

  return (
    <>
      <PageHeader title="All Users" sub="Manage every registered account and their roles." />
      <TableCard
        toolbar={
          <>
            <div role="tablist" className="tabs tabs-box w-fit rounded-full">
              {["", ...ROLES].map((r) => (
                <button
                  key={r || "all"}
                  role="tab"
                  className={`tab rounded-full capitalize ${role === r ? "tab-active" : ""}`}
                  onClick={() => {
                    setRole(r);
                    setPage(1);
                  }}
                >
                  {r || "All"}
                </button>
              ))}
            </div>
            <form
              className="join"
              onSubmit={(e) => {
                e.preventDefault();
                setTerm(search.trim());
                setPage(1);
              }}
            >
              <label className="input input-sm join-item w-60">
                <TbSearch className="opacity-50" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" />
              </label>
              <button className="btn btn-sm btn-secondary join-item">Search</button>
            </form>
          </>
        }
      >
        {isLoading ? (
          <TableSkeleton cols={5} />
        ) : isError ? (
          <ErrorBox onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState title="No users found" />
        ) : (
          <table className={`table ${isFetching ? "opacity-70" : ""}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registration Date</th>
                <th>Change Role</th>
                <th className="text-right">Manage Users</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => {
                const self = u.email === me?.email;
                const role = u.role || "customer";
                return (
                  <tr key={u._id} className={u.banned ? "opacity-60" : ""}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar src={u.image} name={u.name} />
                        <div>
                          <p className="font-semibold">
                            {u.name} {self && <span className="badge badge-ghost badge-xs">you</span>}
                          </p>
                          {u.banned && <span className="badge badge-error badge-xs">suspended</span>}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{u.email}</td>
                    <td>
                      <StatusBadge type="role" value={role} />
                    </td>
                    <td className="whitespace-nowrap text-sm">{formatDate(u.createdAt)}</td>
                    <td>
                      <select
                        className="select select-xs w-32 rounded-full capitalize"
                        value={role}
                        disabled={self || roleM.isPending}
                        onChange={(e) => changeRole(u, e.target.value)}
                        aria-label={`Change role for ${u.name}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button className={`btn btn-xs rounded-full ${u.banned ? "btn-success" : "btn-warning"}`} disabled={self} onClick={() => toggleBan(u)}>
                          {u.banned ? <TbUserCheck /> : <TbBan />} {u.banned ? "Restore" : "Suspend"}
                        </button>
                        <button className="btn btn-xs btn-outline btn-error rounded-full" disabled={self} onClick={() => remove(u)}>
                          <TbTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </TableCard>
      <Pagination className="mt-6" page={page} totalPages={data?.totalPages} onChange={setPage} />
    </>
  );
}
