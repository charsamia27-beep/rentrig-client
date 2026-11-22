"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TbCopy } from "react-icons/tb";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import Pagination from "@/components/shared/Pagination";
import { EmptyState, ErrorBox, PageHeader, StatusBadge, TableCard, TableSkeleton } from "@/components/dashboard/ui";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-payments", page],
    queryFn: async () => (await api.get("/payments/me", { params: { page, limit: 10 } })).data,
    placeholderData: keepPreviousData,
  });

  const copy = (t) => {
    navigator.clipboard?.writeText(t);
    toast.success("Transaction ID copied");
  };

  return (
    <>
      <PageHeader title="Payment History" sub="Every Stripe transaction on your account." />
      <TableCard>
        {isLoading ? (
          <TableSkeleton cols={5} />
        ) : isError ? (
          <ErrorBox onRetry={refetch} />
        ) : !data?.items?.length ? (
          <EmptyState title="No payments yet" text="Payments appear here after a successful checkout." />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Transaction ID</th>
                <th>Paid on</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p._id}>
                  <td className="font-semibold">{p.equipmentName}</td>
                  <td>
                    <button className="inline-flex max-w-[180px] items-center gap-1 truncate font-mono text-xs hover:text-accent" onClick={() => copy(p.transactionId)}>
                      <span className="truncate">{p.transactionId}</span> <TbCopy className="shrink-0" />
                    </button>
                  </td>
                  <td className="whitespace-nowrap">{formatDate(p.paidAt)}</td>
                  <td className="whitespace-nowrap text-sm">{p.method}</td>
                  <td className="font-bold">{formatCurrency(p.amount)}</td>
                  <td>
                    <StatusBadge type="payment" value={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>
      <Pagination className="mt-6" page={page} totalPages={data?.totalPages} onChange={setPage} />
    </>
  );
}
