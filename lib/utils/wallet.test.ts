import { describe, expect, it } from "vitest";

import { resolveWalletBreakdown } from "./wallet";

describe("resolveWalletBreakdown", () => {
  it("keeps a real availableBalance of 0 instead of falling back to the ledger balance", () => {
    const breakdown = resolveWalletBreakdown({
      balance: 78,
      pendingBalance: 78,
      availableBalance: 0,
      totalBalance: 78,
      heldOrderEarnings: 8,
      pendingWithdrawalBalance: 70,
      unclassifiedPendingBalance: 0,
    });

    expect(breakdown.available).toBe(0);
    expect(breakdown.total).toBe(78);
    expect(breakdown.heldEarnings).toBe(8);
    expect(breakdown.reservedWithdrawals).toBe(70);
    expect(breakdown.pendingTotal).toBe(78);
  });

  it("falls back to the ledger balance only when availableBalance is absent", () => {
    const breakdown = resolveWalletBreakdown({
      balance: 250,
      pendingBalance: 50,
    });

    expect(breakdown.available).toBe(250);
    expect(breakdown.pendingTotal).toBe(50);
    expect(breakdown.total).toBe(300);
  });

  it("sums hold buckets when pendingBalance is missing", () => {
    const breakdown = resolveWalletBreakdown({
      balance: 100,
      pendingBalance: undefined as unknown as number,
      availableBalance: 40,
      heldOrderEarnings: 30,
      pendingWithdrawalBalance: 20,
      unclassifiedPendingBalance: 10,
    });

    expect(breakdown.pendingTotal).toBe(60);
    expect(breakdown.total).toBe(100);
  });

  it("prefers the server totalBalance when present", () => {
    const breakdown = resolveWalletBreakdown({
      balance: 10,
      pendingBalance: 5,
      availableBalance: 10,
      totalBalance: 999,
    });

    expect(breakdown.total).toBe(999);
  });

  it("treats non-finite values as zero", () => {
    const breakdown = resolveWalletBreakdown({
      balance: Number.NaN,
      pendingBalance: Number.POSITIVE_INFINITY,
      availableBalance: Number.NaN,
    });

    expect(breakdown.available).toBe(0);
    expect(breakdown.pendingTotal).toBe(0);
    expect(breakdown.total).toBe(0);
  });
});
