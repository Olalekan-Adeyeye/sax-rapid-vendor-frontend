"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Tag, Calendar, Hash, Percent, Banknote } from "lucide-react";
import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { updateVendorCoupon } from "@/lib/api/services/coupons";
import type { ApiError } from "@/lib/api/types/auth.types";
import type { Coupon } from "@/lib/api/types/coupons.types";
import { useToast } from "@/lib/context/ToastContext";
import {
  editCouponSchema,
  type EditCouponFormValues,
} from "@/lib/schemas/coupons";

interface EditCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  coupon: Coupon;
}

export function EditCouponModal({
  isOpen,
  onClose,
  onSuccess,
  coupon,
}: EditCouponModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditCouponFormValues>({
    resolver: zodResolver(editCouponSchema),
    defaultValues: {
      code: coupon.code ?? "",
      discountType:
        coupon.discountType === "FixedAmount" ? "FixedAmount" : "Percentage",
      value: String(coupon.value ?? ""),
      usageLimit: String(coupon.usageLimit ?? ""),
      minimumOrderAmount: String(coupon.minimumOrderAmount ?? ""),
      maximumDiscountAmount: String(coupon.maximumDiscountAmount ?? ""),
      endDate: coupon.endDate ? coupon.endDate.split("T")[0] : "",
      description: coupon.description ?? "",
    },
  });

  const discountType = useWatch({ control, name: "discountType" });

  const onSubmit = async (data: EditCouponFormValues) => {
    setLoading(true);
    try {
      await updateVendorCoupon(coupon.id, {
        code: data.code,
        discountType: data.discountType,
        discountValue: Number(data.value),
        usageLimit:
          Number(data.usageLimit) > 0 ? Number(data.usageLimit) : null,
        expiryDate: new Date(data.endDate).toISOString(),
        description: data.description || null,
      });
      toast("Success", "Coupon updated successfully", "success");
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      let errorMessage = "Failed to update coupon";
      if (axios.isAxiosError<ApiError>(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Discount Coupon"
      subtitle="Update your promo code details"
      icon={Tag}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="coupon-code"
            label="Coupon Code"
            placeholder="e.g. SUMMER20"
            required
            {...register("code")}
            error={errors.code?.message}
            leftSlot={<Hash size={14} className="text-gray-400" />}
          />
          <Controller
            control={control}
            name="discountType"
            render={({ field }) => (
              <Select
                id="discount-type"
                label="Discount Type"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                options={[
                  { label: "Percentage (%)", value: "Percentage" },
                  { label: "Fixed Amount", value: "FixedAmount" },
                ]}
                required
                error={errors.discountType?.message}
                searchable
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="discount-value"
            label="Discount Value"
            type="number"
            min={0}
            placeholder="0"
            required
            {...register("value")}
            error={errors.value?.message}
            leftSlot={
              discountType === "Percentage" ? (
                <Percent size={14} className="text-gray-400" />
              ) : (
                <Banknote size={14} className="text-gray-400" />
              )
            }
          />
          <Input
            id="usage-limit"
            label="Usage Limit"
            type="number"
            min={0}
            placeholder="e.g. 100 (0 for unlimited)"
            {...register("usageLimit")}
            error={errors.usageLimit?.message}
            leftSlot={<Hash size={14} className="text-gray-400" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="minimum-order-amount"
            label="Minimum Order Amount"
            type="number"
            min={0}
            placeholder="0.00"
            {...register("minimumOrderAmount")}
            error={errors.minimumOrderAmount?.message}
            leftSlot={<Banknote size={14} className="text-gray-400" />}
          />
          <Input
            id="maximum-discount-amount"
            label="Maximum Discount Amount"
            type="number"
            min={0}
            placeholder="0.00"
            {...register("maximumDiscountAmount")}
            error={errors.maximumDiscountAmount?.message}
            leftSlot={<Banknote size={14} className="text-gray-400" />}
          />
        </div>

        <Input
          id="expiry-date"
          label="Expiry Date"
          type="date"
          required
          {...register("endDate")}
          error={errors.endDate?.message}
          leftSlot={<Calendar size={14} className="text-gray-400" />}
        />

        <TextArea
          id="coupon-description"
          label="Description"
          placeholder="Brief details about this coupon"
          {...register("description")}
          error={errors.description?.message}
          rows={3}
        />

        <div className="pt-4">
          <Button type="submit" loading={loading} variant="black" fullWidth>
            Update Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
}
