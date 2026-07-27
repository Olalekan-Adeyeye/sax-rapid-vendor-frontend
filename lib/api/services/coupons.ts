import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type { Coupon, CreateVendorCouponRequestDTO, UpdateCouponRequestDTO } from "../types/coupons.types";

const BASE_PATH = "/vendor/coupons";

/**
 * GET /api/vendor/coupons
 * Returns all coupons belonging to the authenticated vendor.
 */
export async function getVendorCoupons(): Promise<Coupon[]> {
  const response = await apiClient.get<ApiResponse<Coupon[]>>(`${BASE_PATH}`);
  return response.data.data;
}

/**
 * POST /api/vendor/coupons
 * Creates a new coupon restricted to the authenticated vendor's store.
 */
export async function createVendorCoupon(data: CreateVendorCouponRequestDTO): Promise<void> {
  await apiClient.post(`${BASE_PATH}`, data);
}

/**
 * PUT /api/coupons/{couponId}
 * Updates an existing coupon.
 */
export async function updateVendorCoupon(couponId: string, data: UpdateCouponRequestDTO): Promise<void> {
  await apiClient.put(`/coupons/${couponId}`, data);
}

/**
 * DELETE /api/coupons/{couponId}
 * Deletes a coupon by ID.
 */
export async function deleteVendorCoupon(couponId: string): Promise<void> {
  await apiClient.delete(`/coupons/${couponId}`);
}
