"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tag, Calendar, Hash, Percent } from "lucide-react";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCouponModal({ isOpen, onClose }: CreateCouponModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Discount Coupon"
      subtitle="Issue new promo codes for your customers"
      icon={Tag}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="coupon-code"
            label="Coupon Code"
            placeholder="e.g. SUMMER20"
            required
            leftSlot={<Hash size={14} className="text-gray-400" />}
          />
          <Select
            id="discount-type"
            label="Discount Type"
            options={[
              { label: "Percentage (%)", value: "percentage" },
              { label: "Fixed Amount (NGN)", value: "fixed" },
            ]}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="discount-value"
            label="Discount Value"
            type="number"
            placeholder="0"
            required
            leftSlot={<Percent size={14} className="text-gray-400" />}
          />
          <Input
            id="usage-limit"
            label="Usage Limit"
            type="number"
            placeholder="e.g. 100"
            leftSlot={<Hash size={14} className="text-gray-400" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="start-date"
            label="Start Date"
            type="date"
            required
            leftSlot={<Calendar size={14} className="text-gray-400" />}
          />
          <Input
            id="expiry-date"
            label="Expiry Date"
            type="date"
            required
            leftSlot={<Calendar size={14} className="text-gray-400" />}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Creating Coupon..." : "Create Coupon"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
