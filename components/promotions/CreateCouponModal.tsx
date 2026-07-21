"use client";
import React, { useState } from "react";
import axios from "axios";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Tag, Calendar, Hash, Percent, Banknote } from "lucide-react";
import { createVendorCoupon } from "@/lib/api/services/coupons";
import type { ApiError } from "@/lib/api/types/auth.types";
import { useToast } from "@/lib/context/ToastContext";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCouponModal({ isOpen, onClose, onSuccess }: CreateCouponModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    value: 0,
    usageLimit: 0,
    endDate: "",
    minimumOrderAmount: 0,
    maximumDiscountAmount: 0,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: formData.code,
        discountType: formData.discountType,
        value: Number(formData.value),
        minimumOrderAmount: formData.minimumOrderAmount > 0 ? Number(formData.minimumOrderAmount) : null,
        maximumDiscountAmount: formData.maximumDiscountAmount > 0 ? Number(formData.maximumDiscountAmount) : null,
        usageLimit: formData.usageLimit > 0 ? Number(formData.usageLimit) : null,
        endDate: new Date(formData.endDate).toISOString(),
        description: formData.description || null,
      };

      await createVendorCoupon(payload);
      toast("Success", "Coupon created successfully", "success");
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      let errorMessage = "Failed to create coupon";
      if (axios.isAxiosError<ApiError>(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    const fieldMap: Record<string, string> = {
      "coupon-code": "code",
      "discount-type": "discountType",
      "discount-value": "value",
      "usage-limit": "usageLimit",
      "minimum-order-amount": "minimumOrderAmount",
      "maximum-discount-amount": "maximumDiscountAmount",
      "expiry-date": "endDate",
      "coupon-description": "description",
    };
    setFormData((prev) => ({
      ...prev,
      [fieldMap[id] || id]: val,
    }));
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
            value={formData.code}
            onChange={handleChange}
            leftSlot={<Hash size={14} className="text-gray-400" />}
          />
          <Select
            id="discount-type"
            label="Discount Type"
            value={formData.discountType}
            onChange={handleChange}
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
            value={formData.value}
            onChange={handleChange}
            leftSlot={
              formData.discountType === "percentage"
                ? <Percent size={14} className="text-gray-400" />
                : <Banknote size={14} className="text-gray-400" />
            }
          />
          <Input
            id="usage-limit"
            label="Usage Limit"
            type="number"
            placeholder="e.g. 100 (0 for unlimited)"
            value={formData.usageLimit}
            onChange={handleChange}
            leftSlot={<Hash size={14} className="text-gray-400" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="minimum-order-amount"
            label="Minimum Order Amount"
            type="number"
            placeholder="0.00"
            value={formData.minimumOrderAmount}
            onChange={handleChange}
            leftSlot={<Banknote size={14} className="text-gray-400" />}
          />
          <Input
            id="maximum-discount-amount"
            label="Maximum Discount Amount"
            type="number"
            placeholder="0.00"
            value={formData.maximumDiscountAmount}
            onChange={handleChange}
            leftSlot={<Banknote size={14} className="text-gray-400" />}
          />
        </div>

        <Input
          id="expiry-date"
          label="Expiry Date"
          type="date"
          required
          value={formData.endDate}
          onChange={handleChange}
          leftSlot={<Calendar size={14} className="text-gray-400" />}
        />

        <TextArea
          id="coupon-description"
          label="Description"
          placeholder="Brief details about this coupon"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />

        <div className="pt-4">
          <Button
            type="submit"
            loading={loading}
            variant="black"
            fullWidth
          >
            Create Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
}
