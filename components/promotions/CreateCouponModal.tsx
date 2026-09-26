"use client";
import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Tag, Calendar, Hash, Percent, Banknote } from "lucide-react";
import { createVendorCoupon } from "@/lib/api/services/coupons";
import type { ApiError } from "@/lib/api/types/auth.types";
import {
  createCouponSchema,
  type CreateCouponFormValues,
} from "@/lib/schemas/coupons";
import { useToast } from "@/lib/context/ToastContext";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCouponModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCouponModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCouponFormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      discountType: "Percentage",
      value: "",
      usageLimit: "",
      minimumOrderAmount: "",
      maximumDiscountAmount: "",
      endDate: "",
      description: "",
    },
  });

  const discountType = useWatch({ control, name: "discountType" });

  const onSubmit = async (data: CreateCouponFormValues) => {
    setLoading(true);
    try {
      await createVendorCoupon({
        code: data.code,
        discountType: data.discountType,
        value: Number(data.value),
        minimumOrderAmount:
          Number(data.minimumOrderAmount) > 0
            ? Number(data.minimumOrderAmount)
            : null,
        maximumDiscountAmount:
          Number(data.maximumDiscountAmount) > 0
            ? Number(data.maximumDiscountAmount)
            : null,
        usageLimit: Number(data.usageLimit) > 0 ? Number(data.usageLimit) : null,
        endDate: new Date(data.endDate).toISOString(),
        description: data.description || null,
      });
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create discount Coupon"
      subtitle="Issue new promo codes for your customers"
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
            Create Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
}
