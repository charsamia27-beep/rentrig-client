"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TbEye, TbHeartOff } from "react-icons/tb";
import api, { errorMessage } from "@/lib/api";
import { formatCurrency, unitOf } from "@/lib/utils";
import { EmptyState, ErrorBox, PageHeader, StatusBadge, TableCard, TableSkeleton } from "@/components/dashboard/ui";

export default function FavoritesPage() {
  const qc = useQueryClient();
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => (await api.get("/favorites")).data,
  });

  const remove = useMutation({
    mutationFn: async (equipmentId) => (await api.delete(`/favorites/${equipmentId}`)).data,
    onSuccess: (d) => {
      toast.success(d.message);
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["favorite-ids"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <>
      <PageHeader title="Favorites" sub="Equipment you saved for later." />
      <TableCard>
        {isLoading ? (
          <TableSkeleton cols={6} />
        ) : isError ? (
          <ErrorBox onRetry={refetch} />
        ) : !data.length ? (
          <EmptyState
            title="No favorites yet"
            text="Tap “Add to favorites” on any equipment page to save it here."
            action={
              <Link href="/equipment" className="btn btn-primary btn-rig btn-sm">
                Explore equipment
              </Link>
            }
          />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Location</th>
                <th>Rental Price</th>
                <th>Availability</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ _id, equipment: e }) => (
                <tr key={_id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={e.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <span className="font-semibold">{e.name}</span>
                    </div>
                  </td>
                  <td>{e.category}</td>
                  <td>{e.location}</td>
                  <td className="whitespace-nowrap font-bold">
                    {formatCurrency(e.rentalPrice)} <span className="text-xs font-normal text-base-content/50">/{unitOf(e.rentalType)}</span>
                  </td>
                  <td>
                    {e.status !== "approved" ? (
                      <StatusBadge type="equipment" value={e.status} />
                    ) : (e.availableQuantity ?? 0) > 0 ? (
                      <span className="badge badge-success badge-sm">{e.availableQuantity} available</span>
                    ) : (
                      <span className="badge badge-error badge-sm">Booked out</span>
                    )}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/equipment/${e._id}`} className="btn btn-xs btn-secondary rounded-full">
                        <TbEye /> View Details
                      </Link>
                      <button className="btn btn-xs btn-outline btn-error rounded-full" disabled={remove.isPending} onClick={() => remove.mutate(e._id)}>
                        <TbHeartOff /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
    </>
  );
}
