import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import {
  pickActiveShipment,
  type DeliveryProvider,
  type DeliveryStatus,
  type DeliveryStatusResponse,
  type ShipmentInfo,
} from "../types/delivery.types";

const BASE = "/Delivery";

/**
 * Normalized view of GET /api/Delivery/{orderId}/status:
 * the active shipment flattened to the top level, plus the full model.
 */
export interface DeliveryStatusInfo extends ShipmentInfo {
  deliveryId?: string | null;
  orderId?: string | null;
  shipments?: ShipmentInfo[];
  legacyDelivery?: ShipmentInfo | null;
}

export interface DeliveryTrackingInfo {
  status?: string | null;
  location?: string | null;
  currentLocation?: string | null;
  updatedAt?: string | null;
  lastUpdate?: string | null;
  estimatedDelivery?: string | null;
}

export function normalizeDeliveryId(
  status: DeliveryStatusInfo | null | undefined,
): string | null {
  if (!status) return null;
  return status.id || status.deliveryId || null;
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
  const record = raw as Record<string, unknown>;

  const hasModel =
    Array.isArray(record.shipments) || "legacyDelivery" in record;
  if (!hasModel) {
    // Older flat payload: the shipment itself.
    return raw as DeliveryStatusInfo;
  }

  const model = raw as DeliveryStatusResponse;
  const shipments = (model.shipments ?? []).filter(
    (shipment): shipment is ShipmentInfo => !!shipment,
  );
  const legacy = model.legacyDelivery ?? null;
  const active = pickActiveShipment(shipments, legacy);
  if (!active) return null;

  return {
    ...active,
    deliveryId: active.id ?? null,
    orderId: model.orderId ?? active.orderId ?? orderId,
    shipments,
    legacyDelivery: legacy,
  };
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
