/**
 * Inventory Services
 * Endpoints for vendor stock visibility — /api/inventory/*
 */

import { unwrapEnvelope } from "@/lib/utils/response";

import apiClient from "../apiClient";
import type { InventoryItemDTO } from "../types/inventory.types";

function toInventoryArray(value: unknown): InventoryItemDTO[] {
  const raw = unwrapEnvelope(value);
  if (Array.isArray(raw)) return raw as InventoryItemDTO[];
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    for (const key of ["items", "data", "results", "products"]) {
      if (Array.isArray(record[key])) return record[key] as InventoryItemDTO[];
    }
  }
  return [];
}

/**
 * GET /api/inventory/status
 * Paginated table of all products with inventory status and stock level.
 */
export async function getInventoryStatus(params?: {
  status?: string;
  categoryId?: number;
  pageNumber?: number;
  pageSize?: number;
}): Promise<InventoryItemDTO[]> {
  const response = await apiClient.get<unknown>("/inventory/status", {
    params: {
      pageNumber: 1,
      pageSize: 100,
      ...params,
    },
  });
  return toInventoryArray(response.data);
}
