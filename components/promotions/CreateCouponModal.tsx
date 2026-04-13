"use client";
import React, { useState } from "react";
import axios from "axios";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Tag, Calendar, Hash, Percent, Truck, Eye } from "lucide-react";
import { createCoupon, updateCoupon } from "@/lib/api/services/coupons";
import type { CouponListItemDTO } from "@/lib/api/types/coupons.types";
import type { ApiError } from "@/lib/api/types/auth.types";
import { useToast } from "@/lib/context/ToastContext";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: CouponListItemDTO | null;
}

export function CreateCouponModal({ isOpen, onClose, onSuccess, initialData }: CreateCouponModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    discountType: initialData?.discountType || "percentage",
    discountValue: initialData?.value || 0,
    scope: initialData?.scope || "Storewide",
    usageLimit: initialData?.usageLimit || 0,
    startDate: "", // Usually start date is not in list DTO, but we can manage
    expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : "",
    allowFreeShipping: false, // Default
    showOnStore: true, // Default
    description: "", // Default
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        discountType: initialData.discountType || "percentage",
        discountValue: initialData.value || 0,
        scope: initialData.scope || "Storewide",
        usageLimit: initialData.usageLimit || 0,
        startDate: "",
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : "",
        allowFreeShipping: false,
        showOnStore: true,
        description: "",
      });
    } else {
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        scope: "Storewide",
        usageLimit: 0,
        startDate: "",
        expiryDate: "",
        allowFreeShipping: false,
        showOnStore: true,
        description: "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: formData.code,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        scope: formData.scope,
        usageLimit: formData.usageLimit > 0 ? Number(formData.usageLimit) : null,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        allowFreeShipping: formData.allowFreeShipping,
        showOnStore: formData.showOnStore,
        description: formData.description,
        status: "Active",
      };

      if (initialData?.id) {
        await updateCoupon(initialData.id, payload);
        toast("Success", "Coupon updated successfully", "success");
      } else {
        await createCoupon(payload);
        toast("Success", "Coupon created successfully", "success");
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      let errorMessage = `Failed to ${initialData ? "update" : "create"} coupon`;
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
    
    // Mapping IDs to formData keys
    const fieldMap: Record<string, string> = {
      "coupon-code": "code",
      "discount-type": "discountType",
      "discount-value": "discountValue",
      "coupon-scope": "scope",
      "usage-limit": "usageLimit",
      "start-date": "startDate",
      "expiry-date": "expiryDate",
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
            value={formData.discountValue}
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
            id="expiry-date"
            label="Expiry Date"
            type="date"
            required
            value={formData.expiryDate}
            onChange={handleChange}
            leftSlot={<Calendar size={14} className="text-gray-400" />}
          />
        </div>

        <TextArea
          id="coupon-description"
          label="Description"
          placeholder="Brief details about this coupon"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                id="allow-free-shipping"
                type="checkbox"
                checked={formData.allowFreeShipping}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
            </div>
            <span className="text-xs font-bold text-black flex items-center gap-2">
              <Truck size={12} className="text-gray-400" />
              Allow Free Shipping
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                id="show-on-store"
                type="checkbox"
                checked={formData.showOnStore}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
            </div>
            <span className="text-xs font-bold text-black flex items-center gap-2">
              <Eye size={12} className="text-gray-400" />
              Show on Store
            </span>
          </label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            loading={loading}
            variant="black"
            fullWidth
          >
            {initialData ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
