"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, Tag, BarChart3, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { CreateCouponModal } from "@/components/promotions/CreateCouponModal";
import { EditCouponModal } from "@/components/promotions/EditCouponModal";
import { CouponDeleteModal } from "@/components/promotions/CouponDeleteModal";
import { CreateCampaignModal } from "@/components/promotions/CreateCampaignModal";
import { PromotionTypePickerModal } from "@/components/promotions/PromotionTypePickerModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVendorCoupons, deleteVendorCoupon } from "@/lib/api/services/coupons";
import type { Coupon } from "@/lib/api/types/coupons.types";
import { formatDate } from "@/lib/utils/date";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatCurrency } from "@/lib/utils/currency";
import { useToast } from "@/lib/context/ToastContext";
import axios from "axios";
import type { ApiError } from "@/lib/api/types/auth.types";

export default function PromotionsPage() {
  const { currency: activeCurrency } = useCurrency();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isPromoTypePickerOpen, setIsPromoTypePickerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Queries
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["vendor-coupons"],
    queryFn: () => getVendorCoupons(),
  });

  const couponList: Coupon[] = coupons || [];
  const filteredCoupons = couponList.filter((c) =>
    c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false,
  );

  const deleteMutation = useMutation({
    mutationFn: (couponId: string) => deleteVendorCoupon(couponId),
    onSuccess: () => {
      toast("Success", "Coupon deleted successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
      setDeletingCoupon(null);
    },
    onError: (err: unknown) => {
      let errorMessage = "Failed to delete coupon";
      if (axios.isAxiosError<ApiError>(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast("Error", errorMessage, "error");
    },
  });

  const handleDelete = () => {
    if (!deletingCoupon) return;
    deleteMutation.mutate(deletingCoupon.id);
  };


  if (isLoading && !couponList.length) {
    return <FullPageLoader label="Loading promotions..." icon={Tag} />;
  }

  return (
    <div className="space-y-12">
      <PageHeader
        title="Promotions"
        description="Create discount coupons and marketing campaigns"
        actions={
          <Button
            onClick={() => setIsPromoTypePickerOpen(true)}
            rounded="full"
            variant="black"
            size="sm"
            className="px-8 flex items-center gap-3"
          >
            <Plus size={16} />
            Create Promotion
          </Button>
        }
      />

      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h4 className="text-sm font-bold text-black flex items-center gap-3">
            <BarChart3 size={14} className="text-gold" />
            Coupon History
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              placeholder="Search promotions..."
              variant="muted"
              focusColor="gold"
              value={searchInput}
              onChange={setSearchInput}
              onSearch={setSearchQuery}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="overflow-x-auto text-black">
          <table className="w-full text-left min-w-250">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Promotion Code",
                  "Type",
                  "Value",
                  "Usage",
                  "Status",
                  "Expiry Date",
                  "Actions",
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
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5 text-xs font-bold text-black">
                      {coupon.code}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400 capitalize">
                      {coupon.discountType}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gold">
                      {coupon.discountType === "Percentage"
                        ? `${coupon.value}%`
                        : formatCurrency(coupon.value, activeCurrency)}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-500">
                      {coupon.usedCount} / {coupon.usageLimit || "∞"}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${
                          coupon.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : coupon.status === "Expired"
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400">
                      {coupon.endDate
                        ? formatDate(new Date(coupon.endDate))
                        : "No Expiry"}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCoupon(coupon)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                          title="Edit coupon"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingCoupon(coupon)}
                          disabled={deleteMutation.isPending && deleteMutation.variables === coupon.id}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Tag} title="No promotion history found" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PromotionTypePickerModal
        isOpen={isPromoTypePickerOpen}
        onClose={() => setIsPromoTypePickerOpen(false)}
        onSelect={(type) => {
          setIsPromoTypePickerOpen(false);
          if (type === "coupon") setIsCouponModalOpen(true);
          if (type === "campaign") setIsCampaignModalOpen(true);
        }}
      />
      <CreateCouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSuccess={() => {
          setIsCouponModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
        }}
      />
      {editingCoupon && (
        <EditCouponModal
          isOpen={!!editingCoupon}
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSuccess={() => {
            setEditingCoupon(null);
            queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
          }}
        />
      )}
      <CouponDeleteModal
        isOpen={!!deletingCoupon}
        onClose={() => setDeletingCoupon(null)}
        onConfirm={handleDelete}
        couponCode={deletingCoupon?.code}
        loading={deleteMutation.isPending}
      />
      <CreateCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
      />
    </div>
  );
}
