import apiClient from "../apiClient";
import type { 
  OrderResponseDTO, 
  UpdateOrderStatusRequest,
  OrderStatsDTO,
  CreateOrderRequestDTO
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

/**
 * GET /api/Orders/admin/stats
 * Retrieves order statistics.
 */
export async function getOrderStats(): Promise<OrderStatsDTO> {
  const response = await apiClient.get<ApiResponse<OrderStatsDTO>>(`${BASE}/admin/stats`);
  return response.data.data;
}

/**
 * POST /api/Orders/{orderId}/cancel
 * Cancels an order if it hasn't been delivered or already cancelled.
 */
export async function cancelOrder(orderId: string): Promise<void> {
  await apiClient.post(`${BASE}/${orderId}/cancel`);
}

/**
 * POST /api/Orders
 * Creates a new order from the current user's cart.
 */
export async function createOrder(data: CreateOrderRequestDTO): Promise<OrderResponseDTO> {
  const response = await apiClient.post<ApiResponse<OrderResponseDTO>>(`${BASE}`, data);
  return response.data.data;
}
