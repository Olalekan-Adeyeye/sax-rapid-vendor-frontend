"use client";
import React, { useState } from "react";
import axios from "axios";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Tag, Calendar, Hash, Percent, Truck, Eye } from "lucide-react";
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
    scope: "Storewide",
    usageLimit: 0,
    startDate: "",
    endDate: "",
    allowFreeShipping: false,
    showOnStore: true,
    status: "Active",
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
      "coupon-scope": "scope",
      "usage-limit": "usageLimit",
      "start-date": "startDate",
      "expiry-date": "endDate",
      "allow-free-shipping": "allowFreeShipping",
      "show-on-store": "showOnStore",
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
            leftSlot={<Percent size={14} className="text-gray-400" />}
          />
          <Select
            id="coupon-scope"
            label="Scope"
            value={formData.scope}
            onChange={handleChange}
            options={[
              { label: "Storewide", value: "Storewide" },
              { label: "Specific Products", value: "SpecificProducts" },
              { label: "Specific Categories", value: "SpecificCategories" },
            ]}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="usage-limit"
            label="Usage Limit"
            type="number"
            placeholder="e.g. 100 (0 for unlimited)"
            value={formData.usageLimit}
            onChange={handleChange}
            leftSlot={<Hash size={14} className="text-gray-400" />}
          />
          <Input
            id="start-date"
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            leftSlot={<Calendar size={14} className="text-gray-400" />}
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

        <div className="space-y-4">
          <label className="flex items-center gap-5 p-5 rounded border border-gray-100 cursor-pointer group hover:border-gray-200 transition-colors">
            <div className="w-12 h-12 rounded flex items-center justify-center bg-blue-50 shrink-0">
              <Truck size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black">Allow Free Shipping</p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Customers pay no shipping fees when using this coupon</p>
            </div>
            <div className="relative flex items-center shrink-0">
              <input
                id="allow-free-shipping"
                type="checkbox"
                checked={formData.allowFreeShipping}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 rounded-full peer-checked:bg-gold transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
            </div>
          </label>

          <label className="flex items-center gap-5 p-5 rounded border border-gray-100 cursor-pointer group hover:border-gray-200 transition-colors">
            <div className="w-12 h-12 rounded flex items-center justify-center bg-purple-50 shrink-0">
              <Eye size={20} className="text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black">Show on Store</p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Display this coupon prominently on your store page</p>
            </div>
            <div className="relative flex items-center shrink-0">
              <input
                id="show-on-store"
                type="checkbox"
                checked={formData.showOnStore}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 rounded-full peer-checked:bg-gold transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7"></div>
            </div>
          </label>
        </div>

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
