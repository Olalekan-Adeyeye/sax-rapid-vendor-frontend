"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, Tag, Rocket, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { CreateCouponModal } from "@/components/promotions/CreateCouponModal";
import { CreateCampaignModal } from "@/components/promotions/CreateCampaignModal";
import { ConfigureFeaturedModal } from "@/components/promotions/ConfigureFeaturedModal";

export default function PromotionsPage() {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);

  const promoCards = [
    {
      title: "Discount Coupons",
      desc: "Create percentage or fixed amount discounts for your customers.",
      icon: Tag,
      color: "bg-gold/20",
      action: "New Coupon",
      onClick: () => setIsCouponModalOpen(true),
    },
    {
      title: "Promotional Campaigns",
      desc: "Launch time-limited store wide sales or seasonal events.",
      icon: Rocket,
      color: "bg-black text-white",
      action: "Start Campaign",
      onClick: () => setIsCampaignModalOpen(true),
    },
    {
      title: "Featured Products",
      desc: "Organize products manually for your store home page.",
      icon: Star,
      color: "bg-gray-50",
      action: "Configure",
      onClick: () => setIsFeaturedModalOpen(true),
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Promotions"
        description="Create discount coupons and marketing campaigns"
        actions={
          <Button 
            onClick={() => setIsCampaignModalOpen(true)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {promoCards.map((promo, i) => (
          <div
            key={i}
            className={`p-8 lg:p-10 rounded border border-gray-100 flex flex-col justify-between group hover:border-gold transition-all ${
              promo.color === "bg-black text-white"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            <div className="mb-10">
              <div
                className={`w-14 h-14 rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                  promo.color === "bg-black text-white"
                    ? "bg-white/10 text-gold"
                    : "bg-gold/20 text-gold"
                }`}
              >
                <promo.icon size={24} />
              </div>
              <h3 className="text-base font-bold mb-4">
                {promo.title}
              </h3>
              <p className="text-xs font-medium leading-relaxed opacity-60">
                {promo.desc}
              </p>
            </div>
            <Button
              onClick={promo.onClick}
              rounded="full"
              variant={promo.color === "bg-black text-white" ? "outline" : "outline"}
              className={`w-full py-3.5 border-none h-auto ${
                promo.color === "bg-black text-white"
                  ? "bg-white text-black hover:bg-gold"
                  : "bg-transparent border border-gray-100 hover:border-black hover:text-black"
              }`}
            >
              {promo.action}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h4 className="text-sm font-bold text-black flex items-center gap-3">
            <Zap size={14} className="text-gold" />
            Active Campaigns
          </h4>
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput
                placeholder="Search campaigns..."
                variant="muted"
              />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-250">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
              {[
                "Campaign Name",
                "Type",
                "Value",
                "Usage",
                "Status",
                "End Date",
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
            {[
              {
                name: "EASTER-SALE-2026",
                type: "Coupon",
                val: "15% OFF",
                used: "124/500",
                status: "Active",
                date: "Apr 15, 2026",
              },
              {
                name: "New Store Launch",
                type: "Campaign",
                val: "Storewide",
                used: "N/A",
                status: "Active",
                date: "Mar 30, 2026",
              },
              {
                name: "WELCOME-RAPID",
                type: "Coupon",
                val: "₦5,000",
                used: "52/Unlimited",
                status: "Active",
                date: "No Expiry",
              },
              {
                name: "FLASH-2026",
                type: "Campaign",
                val: "25% OFF",
                used: "0",
                status: "Draft",
                date: "N/A",
              },
            ].map((p, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-8 py-5 text-xs font-bold text-black">
                  {p.name}
                </td>
                <td className="px-8 py-5 text-xs font-bold text-gray-400">
                  {p.type}
                </td>
                <td className="px-8 py-5 text-xs font-bold text-gold">
                  {p.val}
                </td>
                <td className="px-8 py-5 text-xs font-bold text-gray-500">
                  {p.used}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded ${
                      p.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-xs font-bold text-gray-400">
                  {p.date}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="link"
                      onClick={() => {}}
                      className="text-black hover:text-gold"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {}}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modals */}
      <CreateCouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />
      <CreateCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
      />
      <ConfigureFeaturedModal
        isOpen={isFeaturedModalOpen}
        onClose={() => setIsFeaturedModalOpen(false)}
      />
    </div>
  );
}

