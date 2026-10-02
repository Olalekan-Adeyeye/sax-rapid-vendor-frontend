import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type { DeliveryProvider, DeliveryStatus } from "../types/delivery.types";

const BASE = "/Delivery";

export interface DeliveryQuote {
  provider?: string | null;
  providerCode?: string | null;
  deliveryFee?: number | null;
  price?: number | null;
  amount?: number | null;
  fee?: number | null;
  currency?: string | null;
  eta?: string | null;
  estimatedDeliveryTime?: string | null;
}

export interface DeliveryStatusInfo {
  id?: string | null;
  deliveryId?: string | null;
  status?: string | null;
  provider?: string | null;
  providerCode?: string | null;
  trackingCode?: string | null;
  trackingNumber?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface DeliveryTrackingInfo {
  status?: string | null;
  location?: string | null;
  currentLocation?: string | null;
  updatedAt?: string | null;
  lastUpdate?: string | null;
  estimatedDelivery?: string | null;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function normalizeQuoteProvider(quote: DeliveryQuote): string {
  return quote.provider || quote.providerCode || "Unknown provider";
}

export function normalizeQuoteAmount(quote: DeliveryQuote): number {
  const record = quote as Record<string, unknown>;
  for (const key of ["deliveryFee", "price", "amount", "fee", "total", "cost"]) {
    const value = toFiniteNumber(record[key]);
    if (value !== null) return value;
  }
  return 0;
}

export function normalizeQuoteCurrency(
  quote: DeliveryQuote,
  fallback: string,
): string {
  return quote.currency || fallback;
}

export function normalizeDeliveryId(
  status: DeliveryStatusInfo | null | undefined,
): string | null {
  if (!status) return null;
  return status.id || status.deliveryId || null;
}

/**
 * GET /api/Delivery/quotes/{orderId}
 * Get delivery quotes for an order from available providers
 */
export async function getDeliveryQuotes(
  orderId: string,
): Promise<DeliveryQuote[]> {
  const response =
    await apiClient.get<ApiResponse<unknown>>(`${BASE}/quotes/${orderId}`);
  const raw = response.data.data;
  if (Array.isArray(raw)) return raw as DeliveryQuote[];
  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    for (const key of ["quotes", "items", "data", "results"]) {
      if (Array.isArray(record[key])) return record[key] as DeliveryQuote[];
    }
  }
  return [];
}

/**
 * POST /api/Delivery/{orderId}/request
 * Request a delivery for an order using a provider
 */
export async function requestDelivery(
  orderId: string,
  provider: DeliveryProvider
): Promise<void> {
  await apiClient.post(`${BASE}/${orderId}/request`, null, {
    params: { provider },
  });
}

/**
 * GET /api/Delivery/{orderId}/status
 * Get delivery status for an order. Throws 404 when no delivery requested yet.
 */
export async function getDeliveryStatus(
  orderId: string,
): Promise<DeliveryStatusInfo | null> {
  const response = await apiClient.get<ApiResponse<unknown>>(
    `${BASE}/${orderId}/status`,
  );
  const raw = response.data.data;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as DeliveryStatusInfo;
}

/**
 * PATCH /api/Delivery/{deliveryId}/status
 * Update delivery status (Vendor/Admin only)
 */
export async function updateDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
  trackingCode?: string
): Promise<void> {
  await apiClient.patch(`${BASE}/${deliveryId}/status`, null, {
    params: { status, trackingCode },
  });
}

/**
 * DELETE /api/Delivery/{deliveryId}
 * Cancel a delivery request (Vendor/Admin only)
 */
export async function cancelDelivery(deliveryId: string): Promise<void> {
  await apiClient.delete(`${BASE}/${deliveryId}`);
}

/**
 * GET /api/Delivery/track/{providerCode}/{trackingCode}
 * Live tracking information for a shipment
 */
export async function trackShipment(
  providerCode: string,
  trackingCode: string,
): Promise<DeliveryTrackingInfo | null> {
  const response = await apiClient.get<ApiResponse<unknown>>(
    `${BASE}/track/${providerCode}/${trackingCode}`,
  );
  const raw = response.data.data;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as DeliveryTrackingInfo;
}
