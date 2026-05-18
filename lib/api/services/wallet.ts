/**
 * Wallet Services
 * Strictly following swagger.json
 */

import apiClient from "../apiClient";
import { ApiResponse } from "../types/auth.types";
import {
  WalletDetailsResponseDTO,
  WalletFundRequestDTO,
  VendorWithdrawalRequestDTO,
} from "../types/wallet.types";
import { InitializePaymentResponseDTO } from "../types/payments.types";

const BASE = "/vendor/wallet";

/**
 * GET /api/vendor/wallet
 * Get wallet details
 */
export async function getWalletDetails(): Promise<WalletDetailsResponseDTO> {
  const response = await apiClient.get<ApiResponse<WalletDetailsResponseDTO>>(`${BASE}`);
  return response.data.data;
}

/**
 * POST /api/vendor/wallet/fund
 * Fund wallet
 */
export async function fundWallet(data: WalletFundRequestDTO): Promise<InitializePaymentResponseDTO> {
  const response = await apiClient.post<ApiResponse<InitializePaymentResponseDTO>>(`${BASE}/fund`, data);
  return response.data.data;
}

/**
 * POST /api/vendor/wallet/withdraw
 * Withdraw from wallet
 */
export async function withdraw(data: VendorWithdrawalRequestDTO): Promise<void> {
  await apiClient.post(`${BASE}/withdraw`, data);
}
