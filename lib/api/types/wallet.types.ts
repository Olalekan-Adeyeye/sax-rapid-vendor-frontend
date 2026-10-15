/**
 * TypeScript types for the Wallet module
 * Strictly following swagger.json
 */

export interface WalletDetailsResponseDTO {
  balance: number;
  /** Funds the vendor can withdraw right now (excludes held earnings + reserved withdrawals). */
  availableBalance?: number;
  /** Accounting total: available + all held/pending amounts. */
  totalBalance?: number;
  /** Order earnings held until the customer confirms the order was received. */
  heldOrderEarnings?: number;
  /** Amounts already reserved by in-flight withdrawal requests. */
  pendingWithdrawalBalance?: number;
  /** Pending funds that are neither held earnings nor reserved withdrawals (e.g. disputed orders). */
  unclassifiedPendingBalance?: number;
  pendingBalance: number;
  currency?: string | null;
  recentTransactions?: WalletTransactionResponseDTO[] | null;
}

export interface WalletTransactionResponseDTO {
  id?: string | null;
  transactionReference?: string | null;
  gatewayReference?: string | null;
  provider?: string | null;
  transactionType?: string | null;
  category?: string | null;
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  currency?: string | null;
  status?: string | null;
  description?: string | null;
  transactionDate: string;
}

export interface WalletFundRequestDTO {
  email: string;
  amount: number;
  gateway: "Paystack" | "PayFast" | "Manual";
  callbackUrl?: string | null;
  currency?: string | null;
}

export interface WithdrawRequestDTO {
  amount: number;
  bankAccountId: string;
  currency: string;
}

// Keeping these for backward compatibility if needed, but they might be deprecated
export interface WalletResponseDTO extends WalletDetailsResponseDTO {
  id: string;
  availableBalance: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PagedTransactionsDTO {
  items: WalletTransactionResponseDTO[] | null;
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface UpdateWalletCurrencyDTO {
  newCurrency: string | null;
}