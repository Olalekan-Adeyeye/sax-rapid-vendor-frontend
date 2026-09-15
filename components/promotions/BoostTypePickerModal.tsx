"use client";
import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Zap } from "lucide-react";
import type {
  BoostPricingResponseDTO,
  BoostType,
} from "@/lib/api/types/boost.types";

interface BoostTypePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: BoostType) => void;
  pricing: BoostPricingResponseDTO[];
}

export function BoostTypePickerModal({
  isOpen,
  onClose,
  onSelect,
  pricing,
}: BoostTypePickerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Promotion Type"
      subtitle="Select how you want to promote your product"
      size="md"
    >
      <div className="space-y-4">
        {pricing.map((item) => (
          <button
            key={item.boostType}
            onClick={() => onSelect(item.boostType)}
            className="w-full p-6 rounded border border-gray-100 flex items-center gap-5 text-left transition-all hover:border-gold hover:bg-gold/5"
          >
            <div className="p-2 rounded flex items-center justify-center shrink-0 bg-gold/20 text-gold">
              <Zap size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-black mb-1">
                {item.boostTypeName}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
