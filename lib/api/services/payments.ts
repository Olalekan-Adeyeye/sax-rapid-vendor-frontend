/**
 * Payments Services
 * Strictly following swagger.json
 */

import apiClient from "../apiClient";
import { ApiResponse } from "../types/auth.types";
import {
  InitializePaymentRequestDTO,
  InitializePaymentResponseDTO,
  VerifyPaymentResponseDTO,
  PaymentResponseDTO,
  PaymentGateway,
  PaymentGatewayOptionResponseDTO,
} from "../types/payments.types";

const BASE = "/Payment";

/**
 * POST /api/Payment/initialize
 * Initialize a payment
 */
export async function initializePayment(
  data: InitializePaymentRequestDTO
): Promise<InitializePaymentResponseDTO> {
  const response = await apiClient.post<ApiResponse<InitializePaymentResponseDTO>>(
    `${BASE}/initialize`,
    data
  );
  return response.data.data;
}

/**
 * GET /api/Payment/verify/{reference}
 * Verify a payment by reference
 */
export async function verifyPayment(
  reference: string,
  gateway?: PaymentGateway
): Promise<VerifyPaymentResponseDTO> {
  const response = await apiClient.get<ApiResponse<VerifyPaymentResponseDTO>>(
    `${BASE}/verify/${reference}`,
    { params: { gateway } }
  );
  return response.data.data;
}

/**
 * GET /api/Payment/{reference}
 * Get payment details by reference
 */
export async function getPaymentDetails(reference: string): Promise<VerifyPaymentResponseDTO> {
  const response = await apiClient.get<ApiResponse<VerifyPaymentResponseDTO>>(`${BASE}/${reference}`);
  return response.data.data;
}

/**
 * GET /api/Payment/my
 * Get current user's payments
 */
export async function getMyPayments(): Promise<PaymentResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<PaymentResponseDTO[]>>(`${BASE}/my`);
  return response.data.data;
}

/**
 * GET /api/Payment/order/{orderId}
 * Get all payments for a specific order
 */
export async function getPaymentsByOrder(orderId: string): Promise<PaymentResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<PaymentResponseDTO[]>>(`${BASE}/order/${orderId}`);
  return response.data.data;
}

/**
 * GET /api/Payment/gateways
 * Lists configured checkout gateways (NGN & ZAR), optionally filtered by currency/country.
 */
export async function getPaymentGateways(params?: {
  currency?: string;
  country?: string;
}): Promise<PaymentGatewayOptionResponseDTO[]> {
  const response = await apiClient.get<
    ApiResponse<PaymentGatewayOptionResponseDTO[]>
  >(`${BASE}/gateways`, { params });
  return response.data.data ?? [];
}
