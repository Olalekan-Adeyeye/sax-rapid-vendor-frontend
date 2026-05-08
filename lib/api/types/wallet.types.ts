/**
 * TypeScript types for the Wallet module
 * Strictly following swagger.json
 */

export interface WalletDetailsResponseDTO {
  balance: number;
  pendingBalance: number;
  currency?: string | null;
  recentTransactions?: WalletTransactionResponseDTO[] | null;
}

export interface WalletTransactionResponseDTO {
  id?: string | null;
  transactionReference?: string | null;
  provider?: string | null;
  transactionType?: string | null;
  amount: number;
  status?: string | null;
  transactionDate: string;
}

export interface WalletFundRequestDTO {
  email: string;
  amount: number;
  gateway: "Paystack" | "PayFast" | "Manual";
  callbackUrl?: string | null;
}

export interface VendorWithdrawalRequestDTO {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName?: string | null;
}

// Keeping these for backward compatibility if needed, but they might be deprecated
export interface WalletResponseDTO extends WalletDetailsResponseDTO {
  id: string;
  availableBalance: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PagedWalletTransactionResponseDTO {
  items: WalletTransactionResponseDTO[] | null;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

