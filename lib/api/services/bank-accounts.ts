import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  AddBankAccountDTO,
  BankAccountResponseDTO,
} from "../types/bank-accounts.types";

const BASE = "/bank-accounts";

/**
 * GET /api/bank-accounts
 * Get all saved bank accounts for the current vendor
 */
export async function getBankAccounts(): Promise<BankAccountResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<BankAccountResponseDTO[]>>(`${BASE}`);
  return response.data.data;
}

/**
 * POST /api/bank-accounts
 * Add a new bank account for vendor withdrawals
 */
export async function addBankAccount(
  data: AddBankAccountDTO
): Promise<BankAccountResponseDTO> {
  const response = await apiClient.post<ApiResponse<BankAccountResponseDTO>>(`${BASE}`, data);
  return response.data.data;
}

/**
 * PATCH /api/bank-accounts/{bankAccountId}/default
 * Set a bank account as the default withdrawal account
 */
export async function setDefaultBankAccount(bankAccountId: string): Promise<void> {
  await apiClient.patch(`${BASE}/${bankAccountId}/default`);
}

/**
 * DELETE /api/bank-accounts/{bankAccountId}
 * Delete a bank account
 */
export async function deleteBankAccount(bankAccountId: string): Promise<void> {
  await apiClient.delete(`${BASE}/${bankAccountId}`);
}
