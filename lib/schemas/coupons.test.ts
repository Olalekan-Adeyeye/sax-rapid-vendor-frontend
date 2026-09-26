import { describe, expect, it } from "vitest";

import { createCouponSchema } from "./coupons";

const validCreate = {
  code: "SUMMER20",
  discountType: "Percentage",
  value: "20",
  usageLimit: "100",
  minimumOrderAmount: "0",
  maximumDiscountAmount: "0",
  endDate: "2030-01-01",
  description: "",
};

describe("createCouponSchema", () => {
  it("accepts a valid coupon", () => {
    expect(() => createCouponSchema.parse(validCreate)).not.toThrow();
  });

  it("rejects empty code and empty date", () => {
    expect(
      createCouponSchema.safeParse({ ...validCreate, code: "" }).success,
    ).toBe(false);
    expect(
      createCouponSchema.safeParse({ ...validCreate, endDate: "" }).success,
    ).toBe(false);
  });

  it("rejects non-positive and non-numeric values", () => {
    expect(
      createCouponSchema.safeParse({ ...validCreate, value: "0" }).success,
    ).toBe(false);
    expect(
      createCouponSchema.safeParse({ ...validCreate, value: "-5" }).success,
    ).toBe(false);
    expect(
      createCouponSchema.safeParse({ ...validCreate, value: "abc" }).success,
    ).toBe(false);
  });

  it("caps percentage at 100 but allows large fixed amounts", () => {
    expect(
      createCouponSchema.safeParse({ ...validCreate, value: "101" }).success,
    ).toBe(false);
    expect(
      createCouponSchema.safeParse({
        ...validCreate,
        discountType: "FixedAmount",
        value: "5000",
      }).success,
    ).toBe(true);
  });
});
