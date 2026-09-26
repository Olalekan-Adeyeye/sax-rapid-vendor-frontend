"use client";
import React, { useState } from "react";
import {
  Plus,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Coins,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import * as walletService from "@/lib/api/services/wallet";
import { formatCurrency } from "@/lib/utils/currency";
import { getRelativeTime } from "@/lib/utils/date";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";
import { useAuth } from "@/lib/context/AuthContext";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

import Link from "next/link";
import { FundWalletModal } from "@/components/wallet/FundWalletModal";
import { useCurrency } from "@/lib/hooks/useCurrency";

export default function WalletPage() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { currency: regionCurrency } = useCurrency();

  // Modal States
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  // Queries
  const {
    data: wallet,
    isLoading: loadingWallet,
    error: walletError,
  } = useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: walletService.getWalletDetails,
    enabled: isAuthenticated,
  });

  const activeCurrency = wallet?.currency || regionCurrency;
  const transactions = wallet?.recentTransactions || [];
  const error = walletError ? getErrorMessage(walletError) : null;
  const loadingTransactions = loadingWallet;
  const transactionError = !!walletError;

  const handleActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["vendor-wallet"] });
  };

  return (
    <div className="space-y-10">
      {loadingWallet && !wallet ? (
        <FullPageLoader label="Loading wallet..." icon={Coins} />
      ) : error ? (
        <ErrorComponent
          title="Failed to load wallet"
          message={error}
          onRetry={handleActionSuccess}
        />
      ) : (
        <>
          <PageHeader
            title="My Wallet"
            description="Manage your earnings and balance"
            actions={
              <>
                <Button
                  onClick={() => setIsFundModalOpen(true)}
                  variant="outline"
                  rounded="full"
                  size="sm"
                  className="px-8"
                >
                  <Plus size={16} />
                  Fund Wallet
                </Button>
                <Link href="/withdrawals">
                  <Button rounded="full" size="sm" className="px-8">
                    <CreditCard size={16} />
                    Request Payout
                  </Button>
                </Link>
              </>
            }
          />

          <div className="space-y-10">
            {/* Balance Section */}
            {loadingWallet ? (
              <div className="bg-black text-white rounded p-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
                <p className="text-xs font-bold text-gray-400">
                  Loading Balance...
                </p>
              </div>
            ) : (
              <div className="bg-black text-white rounded p-6 lg:p-8 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded group-hover:bg-gold/10 transition-colors" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/5 blur-3xl rounded" />

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Main balance */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-gray-500 group-hover:text-gold transition-colors uppercase tracking-widest">
                          Balance Overview
                        </p>
                        <div className="flex bg-white/10 rounded px-2 py-0.5 border border-white/5">
                          <span className="text-[10px] font-black text-white">
                            {activeCurrency}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-black tracking-tighter">
                        {formatCurrency(wallet?.balance || 0, activeCurrency)}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-500">
                        Total Wallet Balance
                      </p>
                    </div>

                    {/* Right: Stat boxes */}
                    <div className="flex gap-3 shrink-0">
                      <div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors border border-white/5">
                        <p className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                          Available
                        </p>
                        <p className="text-sm font-bold wrap-break-word">
                          {formatCurrency(wallet?.balance || 0, activeCurrency)}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors border border-white/5">
                        <p className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                          Pending
                        </p>
                        <p className="text-sm font-bold">
                          {formatCurrency(
                            wallet?.pendingBalance || 0,
                            activeCurrency,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Section */}
            <div className="bg-white border border-gray-100 rounded overflow-hidden transition-shadow">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h4 className="text-xs font-bold text-black">
                  Transaction History
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loadingTransactions ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-gold animate-spin" />
                            <p className="text-xs font-bold text-gray-400">
                              Retrieving History...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : transactionError ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <AlertTriangle className="text-amber-500" size={40} />
                            <div className="text-center">
                              <h4 className="text-lg font-black uppercase tracking-tight text-black">
                                History Sync Failed
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">
                                We couldn&apos;t load your recent activity.
                              </p>
                            </div>
                            <Button
                              onClick={() =>
                                queryClient.invalidateQueries({
                                  queryKey: ["wallet-transactions"],
                                })
                              }
                              variant="black"
                              size="sm"
                              className="px-8 mt-4"
                              rounded="full"
                            >
                              Retry Refresh
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <EmptyState icon={Clock} title="No Transactions" description="Your wallet activity will be listed here." />
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t, i) => {
                        const isCredit =
                          t.transactionType?.toLowerCase() === "credit";
                        const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

                        return (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-10 h-10 rounded bg-gray-50 flex items-center justify-center shrink-0 ${isCredit ? "text-green-500" : "text-red-500"}`}
                                >
                                  <Icon size={18} />
                                </div>
                                <span className="text-sm font-bold text-black">
                                  {t.transactionReference || "System Transaction"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-gray-400 whitespace-nowrap">{t.transactionType}</td>
                            <td className="px-6 py-4 text-xs font-medium text-gray-400 whitespace-nowrap">{getRelativeTime(t.transactionDate)}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <span className={`text-sm font-black ${isCredit ? "text-green-500" : "text-black"}`}>
                                {isCredit ? "+" : "-"}
                                {formatCurrency(t.amount, activeCurrency)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-[10px] font-bold text-gray-400">{t.status}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {transactions.length > 0 && !loadingTransactions && (
                <div className="p-8 border-t border-gray-50">
                  <Link href="/wallet/transactions">
                    <Button
                      fullWidth
                      variant="outline"
                      size="sm"
                      className="py-4 text-gray-500 hover:text-black"
                    >
                      View Full Statement
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <FundWalletModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        onSuccess={handleActionSuccess}
        currency={activeCurrency}
        userEmail={user?.email || ""}
      />
    </div>
  );
}
