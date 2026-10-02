"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Boxes,
  Plus,
  Trash2,
  Power,
  RefreshCw,
  Inbox,
  Package,
} from "lucide-react";
import React, { useState } from "react";

import { CreateBundleModal } from "@/components/bundles/CreateBundleModal";
import { EmptyState } from "@/components/common/EmptyState";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { Button } from "@/components/ui/Button";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getVendorBundles,
  toggleBundleStatus,
  deleteBundle,
} from "@/lib/api/services/bundles";
import type { ProductBundleResponseDTO } from "@/lib/api/types/bundles.types";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

export default function BundlesPage() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { currency: activeCurrency } = useCurrency();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<ProductBundleResponseDTO | null>(null);

  const {
    data: bundles,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["vendor-bundles"],
    queryFn: getVendorBundles,
    enabled: isAuthenticated,
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: toggleBundleStatus,
    onSuccess: (_, bundleId) => {
      const toggled = (bundles || []).find((b) => b.id === bundleId);
      toast(
        "Success",
        toggled?.isActive
          ? "Bundle deactivated"
          : "Bundle activated",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["vendor-bundles"] });
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBundle,
    onSuccess: () => {
      toast("Success", "Bundle deleted successfully", "success");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["vendor-bundles"] });
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast("Refreshed", "Bundle list updated", "success");
    } catch {
      toast("Refresh Failed", "Could not sync bundles", "error");
    }
  };

  if (loading) {
    return <FullPageLoader label="Loading bundles..." icon={Boxes} />;
  }

  const error = queryError ? getErrorMessage(queryError) : null;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Product Bundles"
        description="Group products into discounted combo deals"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="px-6 rounded-full text-xs font-bold gap-2"
            >
              <RefreshCw size={14} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="px-6 rounded-full text-xs font-bold gap-2"
            >
              <Plus size={14} />
              New Bundle
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorComponent
          title="Failed to load bundles"
          message={error}
          onRetry={() => refetch()}
        />
      ) : bundles && bundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white border border-gray-100 rounded p-8 space-y-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded bg-gold/5 flex items-center justify-center text-gold shrink-0">
                    <Boxes size={20} />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-black text-black truncate">
                      {bundle.name || "Untitled bundle"}
                    </h5>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {(bundle.items || []).length} item
                      {(bundle.items || []).length === 1 ? "" : "s"} •{" "}
                      {bundle.createdAt
                        ? new Date(bundle.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 ${bundle.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {bundle.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {bundle.description && (
                <p className="text-xs font-medium text-gray-500 leading-relaxed line-clamp-2">
                  {bundle.description}
                </p>
              )}

              {(bundle.items || []).length > 0 && (
                <div className="space-y-2">
                  {(bundle.items || []).slice(0, 3).map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 text-xs"
                    >
                      <Package size={12} className="text-gray-300 shrink-0" />
                      <span className="font-bold text-gray-600 truncate flex-1">
                        {item.productName || item.productSKU || "Product"}
                      </span>
                      <span className="font-black text-black shrink-0">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                  {(bundle.items || []).length > 3 && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      +{(bundle.items || []).length - 3} more
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xl font-black text-black tracking-tight">
                  {formatCurrency(
                    bundle.price || 0,
                    bundle.currency || activeCurrency,
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMutation.mutate(bundle.id)}
                    disabled={toggleMutation.isPending}
                    title={bundle.isActive ? "Deactivate" : "Activate"}
                    className={`text-[10px] font-black uppercase tracking-widest ${bundle.isActive ? "text-gray-400 hover:text-amber-600" : "text-gray-300 hover:text-green-600"}`}
                  >
                    <Power size={14} />
                    {bundle.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(bundle)}
                    className="text-gray-300 hover:text-red-500 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No Bundles Yet"
          description="Create your first combo deal by grouping products into a discounted bundle."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="rounded-full px-8 gap-2 font-bold"
            >
              <Plus size={16} />
              New Bundle
            </Button>
          }
        />
      )}

      <CreateBundleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["vendor-bundles"] })
        }
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        title="Delete Bundle"
        itemName={deleteTarget?.name ?? undefined}
        itemFallback="this bundle"
        keepLabel="Keep Bundle"
        description="The bundle will be permanently removed. This action cannot be undone."
      />
    </div>
  );
}
