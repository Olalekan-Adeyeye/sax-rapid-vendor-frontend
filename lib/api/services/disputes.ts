import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  DisputeResponseDTO,
  DisputeStatsDTO,
} from "../types/disputes.types";

const BASE = "/Disputes";

/**
 * GET /api/Disputes/{id}
 * Get dispute by ID
 */
export async function getDisputeById(id: string): Promise<DisputeResponseDTO> {
  const response = await apiClient.get<ApiResponse<DisputeResponseDTO>>(`${BASE}/${id}`);
  return response.data.data;
}

/**
 * GET /api/Disputes/my
 * Get current user's disputes (Buyer)
 */
export async function getMyDisputes(): Promise<DisputeResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<DisputeResponseDTO[]>>(`${BASE}/my`);
  return response.data.data;
}

/**
 * GET /api/Disputes/vendor
 * Get vendor disputes
 */
export async function getVendorDisputes(): Promise<DisputeResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<DisputeResponseDTO[]>>(`${BASE}/vendor`);
  return response.data.data;
}

/**
 * GET /api/Disputes/stats
 * Get dispute stats (Admin only)
 */
export async function getDisputeStats(
  currency?: string
): Promise<DisputeStatsDTO> {
  const response = await apiClient.get<ApiResponse<DisputeStatsDTO>>(`${BASE}/stats`, {
    params: { currency },
  });
  return response.data.data;
}
