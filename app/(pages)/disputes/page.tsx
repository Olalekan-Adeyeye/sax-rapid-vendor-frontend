"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  Inbox,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { Button } from "@/components/ui/Button";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { getVendorDisputes } from "@/lib/api/services/disputes";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
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

export default function DisputesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { currency: activeCurrency } = useCurrency();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    data: disputes,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["vendor-disputes"],
    queryFn: getVendorDisputes,
    enabled: isAuthenticated,
    retry: false,
  });

  const statusOptions = useMemo(() => {
    const distinct = new Set<string>();
    (disputes || []).forEach((d) => {
      if (d.status) distinct.add(d.status);
    });
    return ["All", ...Array.from(distinct).sort()];
  }, [disputes]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (disputes || []).filter((d) => {
      if (statusFilter !== "All" && d.status !== statusFilter) return false;
      if (!q) return true;
      return [d.caseId, d.orderNumber, d.reason, d.notes]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [disputes, searchQuery, statusFilter]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast("Refreshed", "Dispute list updated", "success");
    } catch {
      toast("Refresh Failed", "Could not sync disputes", "error");
    }
  };

  if (loading) {
    return <FullPageLoader label="Loading disputes..." icon={ShieldAlert} />;
  }

  const error = queryError ? getErrorMessage(queryError) : null;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Disputes"
        description="Buyer disputes raised against your store"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="px-6 rounded-full text-xs font-bold gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
        }
      />

      {error ? (
        <ErrorComponent
          title="Failed to load disputes"
          message={error}
          onRetry={() => refetch()}
        />
      ) : (
        <div className="bg-white border border-gray-100 rounded overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row gap-4">
            <SearchInput
              placeholder="Search by case, order or reason..."
              value={searchInput}
              onChange={setSearchInput}
              onSearch={setSearchQuery}
              variant="white"
              focusColor="gold"
              fullWidth
            />
            <Select
              id="dispute-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions.map((s) => ({ label: s, value: s }))}
              className="sm:w-48 shrink-0 py-3!"
            />
          </div>
          {filtered.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filtered.map((dispute) => (
                <div
                  key={dispute.id}
                  onClick={() => router.push(`/disputes/${dispute.id}`)}
                  className="p-6 lg:p-8 hover:bg-gray-50/80 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <AlertCircle size={18} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h5 className="text-sm font-black text-black truncate group-hover:text-gold transition-colors">
                          {dispute.caseId ||
                            `Case ${dispute.id.slice(0, 8)}`}
                        </h5>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getDisputeStatusStyle(dispute.status || "")}`}
                          >
                            {dispute.status || "Unknown"}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-gray-300 group-hover:text-gold transition-colors"
                          />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-gray-500 leading-relaxed">
                        {dispute.reason || "No reason provided"}
                        {dispute.orderNumber
                          ? ` • Order ${dispute.orderNumber}`
                          : ""}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[11px] font-black text-black">
                          {formatCurrency(
                            dispute.disputedAmount || 0,
                            dispute.currency || activeCurrency,
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {dispute.createdAt
                            ? new Date(dispute.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No Disputes Found"
              description={
                searchQuery || statusFilter !== "All"
                  ? "No disputes match your current filters."
                  : "No buyer has raised a dispute against your store."
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
