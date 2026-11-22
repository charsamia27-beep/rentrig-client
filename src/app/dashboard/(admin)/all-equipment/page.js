"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { TbCheck, TbEdit, TbEye, TbSearch, TbTrash, TbX } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { formatCurrency, formatDate, unitOf } from "@/lib/utils";
import Pagination from "@/components/shared/Pagination";
import EditEquipmentModal from "@/components/dashboard/EditEquipmentModal";
import { EmptyState, ErrorBox, PageHeader, StatusBadge, TableCard, TableSkeleton } from "@/components/dashboard/ui";

const TABS = ["", "pending", "approved", "rejected"];

export default function AdminEquipmentPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [editing, setEditing] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-equipment", page, status, term],
    queryFn: async () => (await api.get("/admin/equipment", { params: { page, limit: 10, status, search: term } })).data,
    placeholderData: keepPreviousData,
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-equipment"] });
    qc.invalidateQueries({ queryKey: ["analytics"] });
  };

  const statusM = useMutation({
    mutationFn: async ({ id, status, reason }) => (await api.patch(`/admin/equipment/${id}/status`, { status, reason })).data,
    onSuccess: (d) => {
      toast.success(d.message);
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const delM = useMutation({
    mutationFn: async (id) => (await api.delete(`/equipment/${id}`)).data,
    onSuccess: (d) => {
      toast.success(d.message);
      refresh();
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Could not delete", text: errorMessage(e) }),
  });

  const reject = async (e) => {
    const r = await Swal.fire({
      title: `Reject “${e.name}”?`,
      input: "text",
      inputLabel: "Reason (shown to the owner)",
      inputPlaceholder: "e.g. Image is unclear, please upload a real photo",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#dc2626",
    });
    if (r.isConfirmed) statusM.mutate({ id: e._id, status: "rejected", reason: r.value });
  };

  const remove = async (e) => {
    const r = await Swal.fire({
      title: `Delete “${e.name}”?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (r.isConfirmed) delM.mutate(e._id);
  };

  const save = async (payload) => {
    const { data: d } = await api.patch(`/equipment/${editing._id}`, payload);
    toast.success(d.message);
    refresh();
    setEditing(null);
  };

  const counts = data?.counts || {};

  return (
    <>
      <PageHeader title="All Equipment" sub="Review, approve and moderate every listing on the platform." />
      <TableCard
        toolbar={
          <>
            <div role="tablist" className="tabs tabs-box w-fit overflow-x-auto rounded-full">
              {TABS.map((s) => (
                <button
                  key={s || "all"}
                  role="tab"
                  className={`tab gap-1.5 rounded-full capitalize ${status === s ? "tab-active" : ""}`}
                  onClick={() => {
                    setStatus(s);
                    setPage(1);
                  }}
                >
                  {s || "All"}
                  {s && <span className="badge badge-xs">{counts[s] || 0}</span>}
                </button>
              ))}
            </div>
            <form
              className="join"
              onSubmit={(ev) => {
                ev.preventDefault();
                setTerm(search.trim());
                setPage(1);
              }}
            >
              <label className="input input-sm join-item w-60">
                <TbSearch className="opacity-50" />
                <input value={search} onChange={(ev) => setSearch(ev.target.value)} placeholder="Name, category or owner email" />
              </label>
              <button className="btn btn-sm btn-secondary join-item">Search</button>
            </form>
          </>
        }
      >
        {isLoading ? (
          <TableSkeleton cols={6} />
        ) : isError ? (
          <ErrorBox onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState title={status === "pending" ? "No listings waiting for approval 🎉" : "No equipment found"} />
        ) : (
          <table className={`table ${isFetching ? "opacity-70" : ""}`}>
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Owner</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((e) => (
                <tr key={e._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={e.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold">{e.name}</p>
                        <p className="text-xs text-base-content/55">Added {formatDate(e.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">
                    <p className="font-semibold">{e.owner?.name}</p>
                    <p className="text-xs text-base-content/55">{e.ownerEmail}</p>
                  </td>
                  <td className="text-sm">{e.category}</td>
                  <td className="whitespace-nowrap font-bold">
                    {formatCurrency(e.rentalPrice)}
                    <span className="text-xs font-normal text-base-content/50">/{unitOf(e.rentalType)}</span>
                  </td>
                  <td>{e.quantity}</td>
                  <td>
                    <StatusBadge type="equipment" value={e.status} />
                  </td>
                  <td>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {e.status !== "approved" && (
                        <button className="btn btn-xs btn-success rounded-full" onClick={() => statusM.mutate({ id: e._id, status: "approved" })}>
                          <TbCheck /> Approve
                        </button>
                      )}
                      {e.status !== "rejected" && (
                        <button className="btn btn-xs btn-warning rounded-full" onClick={() => reject(e)}>
                          <TbX /> Reject
                        </button>
                      )}
                      <button className="btn btn-xs btn-secondary rounded-full" onClick={() => setEditing(e)}>
                        <TbEdit /> Update
                      </button>
                      <Link href={`/equipment/${e._id}`} className="btn btn-xs btn-ghost rounded-full">
                        <TbEye />
                      </Link>
                      <button className="btn btn-xs btn-outline btn-error rounded-full" onClick={() => remove(e)}>
                        <TbTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
      <Pagination className="mt-6" page={page} totalPages={data?.totalPages} onChange={setPage} />
      {editing && <EditEquipmentModal item={editing} onClose={() => setEditing(null)} onSave={save} isAdmin />}
    </>
  );
}
