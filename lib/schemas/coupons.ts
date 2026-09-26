import * as z from "zod";

const positiveAmount = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => {
      const n = Number(v);
      return !Number.isNaN(n) && n > 0;
    }, `${label} must be a positive number`);

const optionalAmount = (label: string, integer = false) =>
  z.string().refine((v) => {
      if (v === "") return true;
      const n = Number(v);
      if (Number.isNaN(n) || n < 0) return false;
      if (integer && !Number.isInteger(n)) return false;
      return true;
    }, `${label} must be 0 or more${integer ? " (whole number)" : ""}`);

const couponFormBase = z.object({
  code: z.string().trim().min(1, "Coupon code is required"),
  discountType: z.enum(["Percentage", "FixedAmount"]),
  value: positiveAmount("Discount value"),
  usageLimit: optionalAmount("Usage limit", true),
  minimumOrderAmount: optionalAmount("Minimum order amount"),
  maximumDiscountAmount: optionalAmount("Maximum discount amount"),
  description: z.string().optional(),
});

const endDateField = z
  .string()
  .min(1, "Expiry date is required")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid expiry date");

const percentageCap = (
  val: { discountType: string; value: string },
  ctx: z.RefinementCtx,
) => {
  if (val.discountType === "Percentage" && Number(val.value) > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["value"],
      message: "Percentage discount cannot exceed 100",
    });
  }
};

export const createCouponSchema = couponFormBase
  .extend({ endDate: endDateField })
  .superRefine(percentageCap);

export const editCouponSchema = couponFormBase
  .extend({ endDate: endDateField })
  .superRefine(percentageCap);

export type CreateCouponFormValues = z.infer<typeof createCouponSchema>;
export type EditCouponFormValues = z.infer<typeof editCouponSchema>;
