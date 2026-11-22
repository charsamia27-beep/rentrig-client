"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { TbEdit, TbEye, TbPlus, TbTrash } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { formatCurrency, unitOf } from "@/lib/utils";
import EditEquipmentModal from "@/components/dashboard/EditEquipmentModal";
import { EmptyState, ErrorBox, PageHeader, StatusBadge, TableCard, TableSkeleton } from "@/components/dashboard/ui";

const FILTERS = ["", "pending", "approved", "rejected"];

export default function MyEquipmentPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(null);

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["my-equipment", status],
    queryFn: async () => (await api.get("/equipment/owner/mine", { params: { status } })).data,
  });

  const del = useMutation({
    mutationFn: async (id) => (await api.delete(`/equipment/${id}`)).data,
    onSuccess: (d) => {
      toast.success(d.message);
      qc.invalidateQueries({ queryKey: ["my-equipment"] });
    },
    onError: (e) => Swal.fire({ icon: "error", title: "Could not delete", text: errorMessage(e) }),
  });

  const confirmDelete = async (item) => {
    const r = await Swal.fire({
      title: `Delete “${item.name}”?`,
      text: "This removes the listing permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (r.isConfirmed) del.mutate(item._id);
  };

  const save = async (payload) => {
    const { data: d } = await api.patch(`/equipment/${editing._id}`, payload);
    toast.success(d.message);
    qc.invalidateQueries({ queryKey: ["my-equipment"] });
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title="My Equipment"
        sub="Everything you have listed on RentRig."
        action={
          <Link href="/dashboard/add-equipment" className="btn btn-primary btn-rig">
            <TbPlus /> Add equipment
          </Link>
        }
      />
      <TableCard
        toolbar={
          <div role="tablist" className="tabs tabs-box w-fit rounded-full">
            {FILTERS.map((s) => (
              <button key={s || "all"} role="tab" className={`tab rounded-full capitalize ${status === s ? "tab-active" : ""}`} onClick={() => setStatus(s)}>
                {s || "All"}
              </button>
            ))}
          </div>
        }
      >
        {isLoading ? (
          <TableSkeleton cols={6} />
        ) : isError ? (
          <ErrorBox onRetry={refetch} />
        ) : !data.length ? (
          <EmptyState
            title="No equipment listed"
            text="Add your first item and start earning."
            action={
              <Link href="/dashboard/add-equipment" className="btn btn-primary btn-rig btn-sm">
                Add equipment
              </Link>
            }
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Category</th>
                <th>Rental Price</th>
                <th>Available Quantity</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => (
                <tr key={e._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={e.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold">{e.name}</p>
                        <p className="text-xs text-base-content/55">{e.location}</p>
                      </div>
                    </div>
                  </td>
                  <td>{e.category}</td>
                  <td className="whitespace-nowrap font-bold">
                    {formatCurrency(e.rentalPrice)} <span className="text-xs font-normal text-base-content/50">/{unitOf(e.rentalType)}</span>
                  </td>
                  <td>
                    {e.availableQuantity} / {e.quantity}
                  </td>
                  <td>
                    <div className="tooltip" data-tip={e.status === "rejected" ? e.rejectionReason || "Rejected" : e.status}>
                      <StatusBadge type="equipment" value={e.status} />
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/equipment/${e._id}`} className="btn btn-xs btn-ghost rounded-full" title="View details">
                        <TbEye /> View
                      </Link>
                      <button className="btn btn-xs btn-secondary rounded-full" onClick={() => setEditing(e)}>
                        <TbEdit /> Update
                      </button>
                      <button className="btn btn-xs btn-outline btn-error rounded-full" disabled={del.isPending} onClick={() => confirmDelete(e)}>
                        <TbTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
      {editing && <EditEquipmentModal item={editing} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}
