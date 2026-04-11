/**
 * Boost Services
 * All endpoints under the "Boosts" tag — /api/Boost/*
 */

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  BoostPricingResponseDTO,
  BoostProductRequestDTO,
  BoostRecordResponseDTO,
  BoostStatus,
} from "../types/boost.types";

const BASE = "/Boost";

/**
 * GET /api/Boost/pricing
 * Returns a list of all available boost types and their pricing.
 */
export async function getBoostPricing(): Promise<BoostPricingResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<BoostPricingResponseDTO[]>>(
    `${BASE}/pricing`
  );
  return response.data.data;
}

/**
 * POST /api/Boost
 * Boost a product (Vendor only).
 */
export async function boostProduct(data: BoostProductRequestDTO): Promise<void> {
  await apiClient.post(`${BASE}`, data);
}

/**
 * GET /api/Boost/my
 * Get my product boosts (Vendor only).
 */
export async function getMyBoosts(
  status?: BoostStatus
): Promise<BoostRecordResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<BoostRecordResponseDTO[]>>(
    `${BASE}/my`,
    {
      params: { status },
    }
  );
  return response.data.data;
}

/**
 * GET /api/Boost/product/{productId}
 * Get boosts for a product.
 */
export async function getBoostsByProduct(
  productId: string
): Promise<BoostRecordResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<BoostRecordResponseDTO[]>>(
    `${BASE}/product/${productId}`
  );
  return response.data.data;
}

/**
 * DELETE /api/Boost/{boostId}
 * Cancel a product boost (Vendor only).
 */
export async function cancelBoost(boostId: string): Promise<void> {
  await apiClient.delete(`${BASE}/${boostId}`);
}
