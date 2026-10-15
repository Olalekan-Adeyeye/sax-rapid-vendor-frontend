import type { WalletDetailsResponseDTO } from "../api/types/wallet.types";

export interface WalletBreakdown {
  /** Withdrawable now. */
  available: number;
  /** Accounting total (available + everything on hold). */
  total: number;
  /** Order earnings held until the customer confirms receipt. */
  heldEarnings: number;
  /** Amounts reserved by in-flight withdrawal requests. */
  reservedWithdrawals: number;
  /** Pending funds outside the two buckets above (e.g. disputed orders). */
  unclassifiedPending: number;
  /** Everything not yet available (held + reserved + unclassified). */
  pendingTotal: number;
}

type WalletBreakdownInput = Pick<
  WalletDetailsResponseDTO,
  | "balance"
  | "pendingBalance"
  | "availableBalance"
  | "totalBalance"
  | "heldOrderEarnings"
  | "pendingWithdrawalBalance"
  | "unclassifiedPendingBalance"
>;

function toAmount(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Normalises the wallet hold breakdown.
 * Falls back to the legacy shape (balance/pendingBalance only) when the
 * backend does not return the newer hold fields yet.
 */
export function resolveWalletBreakdown(
  wallet?: WalletBreakdownInput | null,
): WalletBreakdown {
  const balance = toAmount(wallet?.balance);
  const heldEarnings = toAmount(wallet?.heldOrderEarnings);
  const reservedWithdrawals = toAmount(wallet?.pendingWithdrawalBalance);
  const unclassifiedPending = toAmount(wallet?.unclassifiedPendingBalance);
  const hasHoldDetails =
    wallet?.heldOrderEarnings != null ||
    wallet?.pendingWithdrawalBalance != null ||
    wallet?.unclassifiedPendingBalance != null;

  // A real `availableBalance: 0` (everything on hold) must NOT fall back to
  // the full balance — only fall back when the field is absent entirely.
  const available =
    wallet?.availableBalance != null
      ? toAmount(wallet.availableBalance)
      : balance;
  const pendingTotal =
    wallet?.pendingBalance != null
      ? toAmount(wallet.pendingBalance)
      : hasHoldDetails
        ? heldEarnings + reservedWithdrawals + unclassifiedPending
        : 0;
  const total =
    wallet?.totalBalance != null
      ? toAmount(wallet.totalBalance)
      : available + pendingTotal;

  return {
    available,
    total,
    heldEarnings,
    reservedWithdrawals,
    unclassifiedPending,
    pendingTotal,
  };
}
