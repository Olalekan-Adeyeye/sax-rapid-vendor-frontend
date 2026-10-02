/**
 * Product Bundle Services
 * All endpoints under the "ProductBundles" tag — /api/ProductBundles/*
 */

import { unwrapEnvelope } from "@/lib/utils/response";

import apiClient from "../apiClient";
import type {
  CreateProductBundleDTO,
  ProductBundleResponseDTO,
} from "../types/bundles.types";

const BASE = "/ProductBundles";

function toBundleArray(value: unknown): ProductBundleResponseDTO[] {
  const raw = unwrapEnvelope(value);
  if (Array.isArray(raw)) return raw as ProductBundleResponseDTO[];
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    for (const key of ["items", "data", "results", "bundles"]) {
      if (Array.isArray(record[key]))
        return record[key] as ProductBundleResponseDTO[];
    }
  }
  return [];
}

/**
 * GET /api/ProductBundles/vendor
 * All bundles (active and inactive) created by the authenticated vendor.
 */
export async function getVendorBundles(): Promise<ProductBundleResponseDTO[]> {
  const response = await apiClient.get<unknown>(`${BASE}/vendor`);
  return toBundleArray(response.data);
}

/**
 * GET /api/ProductBundles/{id}
 * Detailed bundle information including component products.
 */
export async function getBundleById(
  id: string,
): Promise<ProductBundleResponseDTO> {
  const response = await apiClient.get<unknown>(`${BASE}/${id}`);
  return unwrapEnvelope(response.data) as ProductBundleResponseDTO;
}

/**
 * POST /api/ProductBundles
 * Create a composite product bundle from existing products.
 */
export async function createBundle(
  data: CreateProductBundleDTO,
): Promise<ProductBundleResponseDTO> {
  const response = await apiClient.post<unknown>(BASE, data);
  return unwrapEnvelope(response.data) as ProductBundleResponseDTO;
}

/**
 * PATCH /api/ProductBundles/{id}/toggle-status
 * Enable or disable a bundle deal.
 */
export async function toggleBundleStatus(id: string): Promise<void> {
  await apiClient.patch(`${BASE}/${id}/toggle-status`);
}

/**
 * DELETE /api/ProductBundles/{id}
 * Permanently remove a bundle. Fails if present in any cart.
 */
export async function deleteBundle(id: string): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}
