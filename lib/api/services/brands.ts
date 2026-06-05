import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type { BrandResponseDTO } from "../types/brands.types";

const BASE = "/Brands";

/**
 * GET /api/Brands
 * Retrieve all active brands
 */
export async function getBrands(): Promise<BrandResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<BrandResponseDTO[]>>(`${BASE}`);
  return response.data.data;
}
