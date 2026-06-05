"use client";
import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Rocket, Star, Eye } from "lucide-react";
import type { BoostType } from "@/lib/api/types/boost.types";

interface BoostTypePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: BoostType) => void;
}

export function BoostTypePickerModal({ isOpen, onClose, onSelect }: BoostTypePickerModalProps) {
  const options = [
    {
      type: "TopSearch" as BoostType,
      title: "Boost Product",
      desc: "Appear at the top of relevant search results.",
      icon: Rocket,
      color: "bg-gold/20 text-gold",
      hover: "hover:border-gold hover:bg-gold/5",
    },
    {
      type: "Featured" as BoostType,
      title: "Featured Product",
      desc: "Showcase your best product on the store homepage.",
      icon: Star,
      color: "bg-black text-white",
      hover: "hover:border-black hover:bg-gray-50",
    },
    {
      type: "CategorySpotlight" as BoostType,
      title: "Category Spotlight",
      desc: "Dominant placement in a specific category page.",
      icon: Eye,
      color: "bg-purple-50 text-purple-600",
      hover: "hover:border-purple-300 hover:bg-purple-50/50",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Promotion Type"
      subtitle="Select how you want to promote your product"
      size="md"
    >
      <div className="space-y-4">
        {options.map((opt) => (
          <button
            key={opt.type}
            onClick={() => onSelect(opt.type)}
            className={`w-full p-6 rounded border border-gray-100 flex items-start gap-5 text-left transition-all ${opt.hover}`}
          >
            <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${opt.color}`}>
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
