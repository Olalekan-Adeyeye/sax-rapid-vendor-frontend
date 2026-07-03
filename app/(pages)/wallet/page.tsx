"use client";
import React, { useState } from "react";
import {
  Plus,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Filter,
  Coins,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import * as walletService from "@/lib/api/services/wallet";
import * as vendorService from "@/lib/api/services/vendor";
import { formatCurrency } from "@/lib/utils/currency";
import { getRelativeTime } from "@/lib/utils/date";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { WithdrawModal } from "@/components/wallet/WithdrawModal";
import Link from "next/link";
import { FundWalletModal } from "@/components/wallet/FundWalletModal";

export default function WalletPage() {
  const queryClient = useQueryClient();

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
  });

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: vendorService.getMyVendorProfile,
  });

  const activeCurrency = wallet?.currency || "NGN";
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Balance Section */}
            <div className="lg:col-span-5 space-y-10">
              {loadingWallet ? (
                <div className="bg-black text-white rounded p-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  <p className="text-xs font-bold text-gray-400">
                    Loading Balance...
                  </p>
                </div>
              ) : (
                <div className="bg-black text-white rounded p-8 lg:p-10 space-y-10 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded group-hover:bg-gold/10 transition-colors" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/5 blur-3xl rounded" />

                  <div className="flex flex-col justify-between relative z-10 gap-1.5">
                    <p className="text-xs font-bold text-gray-500 group-hover:text-gold transition-colors">
                      Balance Overview
                    </p>
                    <div className="flex bg-white/10 rounded p-2 px-4 w-fit border border-white/5">
                      <span className="text-sm font-black text-white">
                        {activeCurrency}
                      </span>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black tracking-tighter mb-2">
                      {formatCurrency(wallet?.balance || 0, activeCurrency)}
                    </h3>
                    <p className="text-xs font-bold text-gray-500">
                      Total Wallet Balance
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors border border-white/5">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">
                        Available
                      </p>
                      <p className="text-sm font-bold wrap-break-word">
                        {formatCurrency(wallet?.balance || 0, activeCurrency)}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors border border-white/5">
                      <p className="text-[10px] font-bold text-gray-500 mb-1">
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
              )}
            </div>

            {/* History Section */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white border border-gray-100 rounded overflow-hidden transition-shadow">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h4 className="text-xs font-bold text-black">
                    Transaction History
                  </h4>
                </div>
                <div className="divide-y divide-gray-50 min-h-100">
                  {loadingTransactions ? (
                    <div className="flex flex-col items-center justify-center h-100 gap-4">
                      <Loader2 className="w-10 h-10 text-gold animate-spin" />
                      <p className="text-xs font-bold text-gray-400">
                        Retrieving History...
                      </p>
                    </div>
                  ) : transactionError ? (
                    <div className="flex flex-col items-center justify-center h-100 space-y-4">
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
                  ) : transactions.length === 0 ? (
                    <EmptyState icon={Clock} title="No Transactions" description="Your wallet activity will be listed here." />
                  ) : (
                    transactions.map((t, i) => {
                      const isCredit =
                        t.transactionType?.toLowerCase() === "deposit" ||
                        t.transactionType?.toLowerCase() === "earnings";
                      const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

                      return (
                        <div
                          key={i}
                          className="p-6 lg:p-8 hover:bg-gray-50/50 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-6">
                            <div
                              className={`w-12 h-12 rounded bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all ${isCredit ? "text-green-500" : "text-red-500"}`}
                            >
                              <Icon size={20} />
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-black group-hover:text-gold transition-colors">
                                {t.transactionReference || "System Transaction"}
                              </h5>
                              <div className="flex items-center gap-3 mt-1 text-xs font-medium text-gray-400">
                                <span>{t.transactionType}</span>
                                <span className="w-1 h-1 rounded bg-gray-300" />
                                <span>
                                  {getRelativeTime(t.transactionDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-black mb-1 ${isCredit ? "text-green-500" : "text-black"}`}
                            >
                              {isCredit ? "+" : "-"}
                              {formatCurrency(t.amount, activeCurrency)}
                            </p>
                            <span className="text-[10px] font-bold text-gray-400">
                              Status: {t.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {transactions.length > 0 && !loadingTransactions && (
                  <div className="p-8 border-t border-gray-50">
                    <Button
                      fullWidth
                      variant="outline"
                      size="sm"
                      className="py-4 text-gray-500 hover:text-black"
                    >
                      View Full Statement
                    </Button>
                  </div>
                )}
              </div>
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
        userEmail={vendor?.ownerEmail || ""}
      />
    </div>
  );
}
