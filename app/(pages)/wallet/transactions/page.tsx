"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Loader2,
  AlertTriangle,
  Coins,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { EmptyState } from "@/components/common/EmptyState";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { formatCurrency } from "@/lib/utils/currency";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatDateTime } from "@/lib/utils/date";
import { getErrorMessage } from "@/lib/utils/errors";
import * as walletService from "@/lib/api/services/wallet";

export default function TransactionLogPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { currency: regionCurrency } = useCurrency();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wallet-transactions", page],
    queryFn: () => walletService.getTransactionLog(page, pageSize),
  });

  const transactions = data?.items || [];
  const errorMessage = error ? getErrorMessage(error) : null;

  const isCredit = (type?: string | null) => type?.toLowerCase() === "credit";

  const statusBadge = (status?: string | null) => {
    const color =
      status === "Completed"
        ? "bg-green-50 text-green-600"
        : status === "Pending"
          ? "bg-blue-50 text-blue-600"
          : "bg-red-50 text-red-600";
    return (
      <span
        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${color}`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  if (isLoading) {
    return <FullPageLoader label="Loading transaction log..." icon={Coins} />;
  }

  return (
    <div className="space-y-10">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => router.push("/wallet")}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group w-fit"
        >
          <ChevronLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Back to Wallet
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-widest">
            Transaction Log
          </h1>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Complete record of all wallet transactions
          </p>
        </div>
      </div>

      {errorMessage && !isLoading ? (
        <ErrorComponent
          title="Failed to load transactions"
          message={errorMessage}
          onRetry={() => refetch()}
        />
      ) : transactions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded">
          <EmptyState
            icon={Clock}
            title="No Transactions"
            description="No transaction history found for your wallet."
          />
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-250">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Date",
                    "Type",
                    "Description",
                    "Reference",
                    "Amount",
                    "Status",
                  ].map((th) => (
                    <th
                      key={th}
                      className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t, i) => {
                  const credit = isCredit(t.transactionType);
                  const Icon = credit ? ArrowDownLeft : ArrowUpRight;
                  return (
                    <tr
                      key={t.id || i}
                      className="hover:bg-gray-50/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-black whitespace-nowrap">
                          {formatDateTime(t.transactionDate)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all ${credit ? "text-green-500" : "text-red-500"}`}
                          >
                            <Icon size={14} />
                          </div>
                          <span className="text-xs font-bold text-black uppercase tracking-wider">
                            {t.transactionType || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-gray-600">
                          {t.description || t.category || "—"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold text-gray-400 font-mono">
                          {t.transactionReference || "—"}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span
                          className={`text-sm font-black ${credit ? "text-green-500" : "text-black"}`}
                        >
                          {credit ? "+" : "-"}
                          {formatCurrency(t.amount, t.currency || regionCurrency)}
                        </span>
                      </td>
                      <td className="px-8 py-6">{statusBadge(t.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 0 && (
            <div className="p-6 border-t border-gray-50">
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={setPage}
                totalCount={data.totalCount}
                pageSize={data.pageSize}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
