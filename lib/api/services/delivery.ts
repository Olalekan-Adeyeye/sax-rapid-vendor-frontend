import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type { DeliveryProvider, DeliveryStatus } from "../types/delivery.types";

const BASE = "/Delivery";

/**
 * GET /api/Delivery/quotes/{orderId}
 * Get delivery quotes for an order from available providers
 */
export async function getDeliveryQuotes(orderId: string): Promise<void> {
  const response = await apiClient.get<ApiResponse<void>>(`${BASE}/quotes/${orderId}`);
  return response.data.data;
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
 * Get delivery status for an order
 */
export async function getDeliveryStatus(orderId: string): Promise<void> {
  const response = await apiClient.get<ApiResponse<void>>(`${BASE}/${orderId}/status`);
  return response.data.data;
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
