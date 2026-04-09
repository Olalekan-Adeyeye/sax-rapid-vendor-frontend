/**
 * Orders Services
 * All endpoints under the "Orders" tag — /api/Orders/*
 */

import apiClient from "../apiClient";
import type { 
  OrderResponseDTO, 
  UpdateOrderStatusRequest 
} from "../types/orders.types";
import type { ApiResponse } from "../types/auth.types";

const BASE = "/Orders";

/**
 * GET /api/Orders/vendor
 * Retrieves a paginated list of orders containing items from the vendor's products.
 */
export async function getVendorOrders(
  page = 1, 
  pageSize = 10
): Promise<OrderResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<OrderResponseDTO[]>>(`${BASE}/vendor`, {
    params: { page, pageSize }
  });
  return response.data.data;
}

/**
 * GET /api/Orders/{orderId}
 * Retrieves a specific order by its unique identifier.
 */
export async function getOrderById(orderId: string): Promise<OrderResponseDTO> {
  const response = await apiClient.get<ApiResponse<OrderResponseDTO>>(`${BASE}/${orderId}`);
  return response.data.data;
}

/**
 * PUT /api/Orders/{orderId}/status
 * Updates the status of an order (e.g., shipped, delivered).
 */
export async function updateOrderStatus(
  orderId: string, 
  request: UpdateOrderStatusRequest
): Promise<OrderResponseDTO> {
  const response = await apiClient.put<ApiResponse<OrderResponseDTO>>(`${BASE}/${orderId}/status`, request);
  return response.data.data;
}
