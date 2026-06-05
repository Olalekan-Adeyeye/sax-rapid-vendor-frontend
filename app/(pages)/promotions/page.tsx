"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, Tag, Rocket, Star, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { CreateCouponModal } from "@/components/promotions/CreateCouponModal";
import { CreateCampaignModal } from "@/components/promotions/CreateCampaignModal";
import { ConfigureFeaturedModal } from "@/components/promotions/ConfigureFeaturedModal";
import { PromotionTypePickerModal } from "@/components/promotions/PromotionTypePickerModal";
import { useQuery } from "@tanstack/react-query";
import { getVendorCoupons } from "@/lib/api/services/coupons";
import type { Coupon } from "@/lib/api/types/coupons.types";
import { formatDate } from "@/lib/utils/date";
import { FullPageLoader } from "@/components/common/FullPageLoader";

export default function PromotionsPage() {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [isPromoTypePickerOpen, setIsPromoTypePickerOpen] = useState(false);

  // Queries
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["vendor-coupons"],
    queryFn: () => getVendorCoupons(),
  });

  const couponList: Coupon[] = coupons || [];


  if (isLoading && !couponList.length) {
    return <FullPageLoader />;
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
              {couponList.length > 0 ? (
                couponList.map((coupon) => (
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
                      {coupon.discountType === "percentage"
                        ? `${coupon.value}%`
                        : `₦${coupon.value.toLocaleString()}`}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Tag size={32} className="text-gray-100" />
                      <p className="text-xs font-bold text-gray-300">
                        No promotion history found
                      </p>
                    </div>
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
        onSuccess={() => setIsCouponModalOpen(false)}
      />
      <CreateCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
      />
    </div>
  );
}
