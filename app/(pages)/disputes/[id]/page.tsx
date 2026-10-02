"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldAlert,
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { FullPageLoader } from "@/components/common/FullPageLoader";
import { Button } from "@/components/ui/Button";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getDisputeById } from "@/lib/api/services/disputes";
import { useAuth } from "@/lib/context/AuthContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

function getDisputeStatusStyle(status: string): string {
  const normalized = (status || "").toLowerCase();
  if (["resolved", "closed", "released"].includes(normalized))
    return "bg-green-50 text-green-600";
  if (["open", "pending", "underreview", "under_review"].includes(normalized))
    return "bg-amber-50 text-amber-600";
  if (["escalated", "fraud"].includes(normalized))
    return "bg-red-50 text-red-500";
  return "bg-gray-100 text-gray-500";
}

export default function DisputeDetailPage() {
  const params = useParams();
  const disputeId = params.id as string;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { currency: activeCurrency } = useCurrency();

  const {
    data: dispute,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["vendor-dispute", disputeId],
    queryFn: () => getDisputeById(disputeId),
    enabled: !!disputeId && isAuthenticated,
    retry: false,
  });

  if (loading) {
    return <FullPageLoader label="Loading dispute..." icon={ShieldAlert} />;
  }

  if (queryError || !dispute) {
    return (
      <ErrorComponent
        title={queryError ? "Failed to load dispute" : "Dispute Not Found"}
        message={
          queryError
            ? getErrorMessage(queryError)
            : "The dispute you are looking for does not exist or has been removed."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const resolved = !!dispute.resolvedAt;

  return (
    <div className="space-y-10 pb-20">
      <div className="space-y-4">
        <button
          onClick={() => router.push("/disputes")}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-bold">Back to Disputes</span>
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-3xl font-black tracking-tighter text-black">
            {dispute.caseId || `Case ${dispute.id.slice(0, 8)}`}
          </h2>
          <span
            className={`px-4 py-1.5 rounded text-xs font-bold ${getDisputeStatusStyle(dispute.status || "")}`}
          >
            {dispute.status || "Unknown"}
          </span>
        </div>
        <p className="text-gray-500 text-sm font-medium">
          Filed on{" "}
          {dispute.createdAt
            ? new Date(dispute.createdAt).toLocaleDateString()
            : "—"}
        </p>
      </div>

      {resolved && (
        <div className="bg-green-50 border border-green-100 rounded p-6 flex items-center gap-4">
          <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          <p className="text-xs font-bold text-green-700">
            Resolved on{" "}
            {dispute.resolvedAt
              ? new Date(dispute.resolvedAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded p-8 space-y-8">
          <div>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
              Reason
            </h4>
            <p className="text-sm font-bold text-black">
              {dispute.reason || "No reason provided"}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
              Buyer Notes
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
              {dispute.notes || "No notes attached to this dispute."}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded p-8 space-y-6 h-fit">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-gray-400">
              Disputed Amount
            </span>
            <span className="text-lg font-black text-black">
              {formatCurrency(
                dispute.disputedAmount || 0,
                dispute.currency || activeCurrency,
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-gray-400">Order</span>
            <span className="text-[12px] font-bold text-black">
              {dispute.orderNumber || dispute.orderId.slice(0, 8)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => router.push(`/orders/${dispute.orderId}`)}
            className="rounded-full text-xs font-bold gap-2"
          >
            <ShoppingBag size={14} />
            View Order
          </Button>
        </div>
      </div>
    </div>
  );
}
