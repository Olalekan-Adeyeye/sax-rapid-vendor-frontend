"use client";
import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Tag, Rocket } from "lucide-react";

interface PromotionTypePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: "coupon" | "campaign") => void;
}

export function PromotionTypePickerModal({
  isOpen,
  onClose,
  onSelect,
}: PromotionTypePickerModalProps) {
  const options = [
    {
      type: "coupon" as const,
      title: "Discount Coupons",
      desc: "Create percentage or fixed amount discounts for your customers.",
      icon: Tag,
      color: "bg-gold/20 text-gold",
      hover: "hover:border-gold hover:bg-gold/5",
    },
    // {
    //   type: "campaign" as const,
    //   title: "Promotional Campaigns",
    //   desc: "Launch time-limited store wide sales or seasonal events.",
    //   icon: Rocket,
    //   color: "bg-black text-white",
    //   hover: "hover:border-black hover:bg-gray-50",
    // },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Promotion Type"
      subtitle="Select what kind of promotion you want to create"
      size="md"
    >
      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.type}
            onClick={() => onSelect(opt.type)}
            className={`w-full p-6 rounded border border-gray-100 flex items-start gap-5 text-left transition-all ${opt.hover}`}
          >
            <div
              className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${opt.color}`}
            >
              <opt.icon size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-black mb-1">{opt.title}</p>
              <p className="text-xs font-medium text-gray-400 leading-relaxed">
                {opt.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
