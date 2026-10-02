import { unwrapEnvelope } from "@/lib/utils/response";

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  DisputeResponseDTO,
  DisputeStatsDTO,
} from "../types/disputes.types";

const BASE = "/Disputes";

function toDisputeArray(value: unknown): DisputeResponseDTO[] {
  const raw = unwrapEnvelope(value);
  if (Array.isArray(raw)) return raw as DisputeResponseDTO[];
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    for (const key of ["items", "data", "results", "disputes"]) {
      if (Array.isArray(record[key]))
        return record[key] as DisputeResponseDTO[];
    }
  }
  return [];
}

/**
 * GET /api/Disputes/{id}
 * Get dispute by ID
 */
export async function getDisputeById(id: string): Promise<DisputeResponseDTO> {
  const response = await apiClient.get<unknown>(`${BASE}/${id}`);
  return unwrapEnvelope(response.data) as DisputeResponseDTO;
}

/**
 * GET /api/Disputes/my
 * Get current user's disputes (Buyer)
 */
export async function getMyDisputes(): Promise<DisputeResponseDTO[]> {
  const response = await apiClient.get<unknown>(`${BASE}/my`);
  return toDisputeArray(response.data);
}

/**
 * GET /api/Disputes/vendor
 * Get vendor disputes
 */
export async function getVendorDisputes(): Promise<DisputeResponseDTO[]> {
  const response = await apiClient.get<unknown>(`${BASE}/vendor`);
  return toDisputeArray(response.data);
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
