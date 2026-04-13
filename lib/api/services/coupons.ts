import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  CouponListItemDTO,
  CouponStatsDTO,
  CreateCouponRequestDTO,
  UpdateCouponRequestDTO,
  CouponQueryParams,
} from "../types/coupons.types";

const BASE_PATH = "/coupons";

/**
 * GET /api/coupons
 * Returns paginated list of coupons.
 */
export async function getCoupons(params?: CouponQueryParams): Promise<CouponListItemDTO[]> {
  const response = await apiClient.get<ApiResponse<CouponListItemDTO[]>>(`${BASE_PATH}`, { params });
  return response.data.data;
}

/**
 * GET /api/coupons/stats
 * Returns coupon statistics.
 */
export async function getCouponStats(): Promise<CouponStatsDTO> {
  const response = await apiClient.get<ApiResponse<CouponStatsDTO>>(`${BASE_PATH}/stats`);
  return response.data.data;
}

/**
 * POST /api/coupons
 * Creates a new coupon.
 */
export async function createCoupon(data: CreateCouponRequestDTO): Promise<CouponListItemDTO> {
  const response = await apiClient.post<ApiResponse<CouponListItemDTO>>(`${BASE_PATH}`, data);
  return response.data.data;
}

/**
 * GET /api/coupons/{couponId}
 */
export async function getCouponById(couponId: string): Promise<CouponListItemDTO> {
  const response = await apiClient.get<ApiResponse<CouponListItemDTO>>(`${BASE_PATH}/${couponId}`);
  return response.data.data;
}

/**
 * PUT /api/coupons/{couponId}
 * Updates an existing coupon.
 */
export async function updateCoupon(
  couponId: string,
  data: UpdateCouponRequestDTO
): Promise<void> {
  await apiClient.put(`${BASE_PATH}/${couponId}`, data);
}

/**
 * DELETE /api/coupons/{couponId}
 * Deletes a coupon.
 */
export async function deleteCoupon(couponId: string): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${couponId}`);
}
