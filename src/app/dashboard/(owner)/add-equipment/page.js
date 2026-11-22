"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import api from "@/lib/api";
import EquipmentForm from "@/components/dashboard/EquipmentForm";
import { PageHeader } from "@/components/dashboard/ui";
import { useDashboardUser } from "@/components/dashboard/DashboardShell";

export default function AddEquipmentPage() {
  const user = useDashboardUser();
  const router = useRouter();
  const qc = useQueryClient();

  const handleSubmit = async (payload) => {
    const { data } = await api.post("/equipment", payload);
    qc.invalidateQueries({ queryKey: ["my-equipment"] });
    const r = await Swal.fire({
      icon: "success",
      title: "Equipment submitted!",
      text: data.message,
      showCancelButton: true,
      confirmButtonText: "View my equipment",
      cancelButtonText: "Add another",
      confirmButtonColor: "#14213d",
    });
    if (r.isConfirmed) router.push("/dashboard/my-equipment");
    return "reset";
  };

  return (
    <>
      <PageHeader title="Add Equipment" sub="List a new item for rent. It will go live after admin approval." />
      <div className="card-surface p-5 md:p-8">
        <EquipmentForm owner={user} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
