/**
 * TypeScript types for the Wallet module
 * Strictly following swagger.json
 */

export interface WalletResponseDTO {
  id: string;
  currency?: string | null;
  balance: number;
  pendingBalance: number;
  availableBalance: number;
  createdAt: string;
  updatedAt?: string | null;
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

export interface FundWalletRequestDTO {
  amount: number;
  paymentReference: string;
  paymentGateway: string; // Paystack, PayFast, Manual
}

export interface WithdrawRequestDTO {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingNumber?: string | null;
  currency?: string | null;
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
