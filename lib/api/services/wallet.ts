/**
 * Wallet Services
 * Strictly following swagger.json
 */

import apiClient from "../apiClient";
import { ApiResponse } from "../types/auth.types";
import {
  WalletResponseDTO,
  PagedWalletTransactionResponseDTO,
  FundWalletRequestDTO,
  WithdrawRequestDTO,
} from "../types/wallet.types";

const BASE = "/Wallet";

/**
 * GET /api/Wallet
 * Get my wallet
 */
export async function getMyWallet(): Promise<WalletResponseDTO> {
  const response = await apiClient.get<ApiResponse<WalletResponseDTO>>(`${BASE}`);
  return response.data.data;
}

/**
 * GET /api/Wallet/transactions
 * Get transaction history
 */
export async function getTransactionHistory(
  pageIndex = 1,
  pageSize = 20
): Promise<PagedWalletTransactionResponseDTO> {
  const response = await apiClient.get<ApiResponse<PagedWalletTransactionResponseDTO>>(
    `${BASE}/transactions`,
    { params: { pageIndex, pageSize } }
  );
  return response.data.data;
}

/**
 * POST /api/Wallet/fund
 * Fund wallet
 */
export async function fundWallet(data: FundWalletRequestDTO): Promise<WalletResponseDTO> {
  const response = await apiClient.post<ApiResponse<WalletResponseDTO>>(`${BASE}/fund`, data);
  return response.data.data;
}

/**
 * POST /api/Wallet/withdraw
 * Withdraw from wallet
 */
export async function withdraw(data: WithdrawRequestDTO): Promise<void> {
  await apiClient.post(`${BASE}/withdraw`, data);
}
