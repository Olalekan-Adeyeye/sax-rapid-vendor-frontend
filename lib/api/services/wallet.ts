/**
 * Wallet Services
 * Strictly following swagger.json
 */

import apiClient from "../apiClient";
import { ApiResponse } from "../types/auth.types";
import {
  WalletDetailsResponseDTO,
  WalletFundRequestDTO,
  WithdrawRequestDTO,
  UpdateWalletCurrencyDTO,
  PagedTransactionsDTO,
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
export async function withdraw(data: WithdrawRequestDTO): Promise<void> {
  await apiClient.post(`${BASE}/withdraw`, data);
}

/**
 * PUT /api/Wallet/currency
 * Changes the vendor's wallet currency. Only allowed if balance is zero.
 */
export async function changeCurrency(data: UpdateWalletCurrencyDTO): Promise<void> {
  const response = await apiClient.put<void>("/Wallet/currency", data);
  return response.data;
}

/**
 * GET /api/vendor/wallet/transactions
 * Get paginated full transaction log for the authenticated vendor
 */
export async function getTransactionLog(page = 1, pageSize = 20): Promise<PagedTransactionsDTO> {
  const response = await apiClient.get<ApiResponse<PagedTransactionsDTO>>(`${BASE}/transactions`, {
    params: { page, pageSize },
  });
  return response.data.data;
}