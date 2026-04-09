"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
	Plus,
	CreditCard,
	ArrowUpRight,
	ArrowDownLeft,
	Clock,
	Search,
	Filter,
	Coins,
	Loader2,
	AlertTriangle,
} from "lucide-react";
import * as walletService from "@/lib/api/services/wallet";
import { WalletResponseDTO, WalletTransactionResponseDTO } from "@/lib/api/types/wallet.types";
import { useToast } from "@/lib/context/ToastContext";
import { formatCurrency } from "@/lib/utils/currency";
import { getRelativeTime } from "@/lib/utils/date";

// Modals
import { FundWalletModal } from "@/components/wallet/FundWalletModal";
import { WithdrawModal } from "@/components/wallet/WithdrawModal";

export default function WalletPage() {
	const { toast } = useToast();
	
	const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
	const [transactions, setTransactions] = useState<WalletTransactionResponseDTO[]>([]);
	
	const [loadingWallet, setLoadingWallet] = useState(true);
	const [loadingTransactions, setLoadingTransactions] = useState(true);
  
	const [walletError, setWalletError] = useState(false);
	const [transactionError, setTransactionError] = useState(false);
  
	const [activeCurrency, setActiveCurrency] = useState("NGN");

  // Modal States
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

	const fetchWallet = useCallback(async () => {
		try {
			setLoadingWallet(true);
			setWalletError(false);
			const data = await walletService.getMyWallet();
			setWallet(data);
			if (data.currency) setActiveCurrency(data.currency);
		} catch (err) {
			console.error("Failed to fetch wallet:", err);
			setWalletError(true);
			toast("Wallet Error", "Could not retrieve balance", "error");
		} finally {
			setLoadingWallet(false);
		}
	}, [toast]);

	const fetchTransactions = useCallback(async () => {
		try {
			setLoadingTransactions(true);
			setTransactionError(false);
			const data = await walletService.getTransactionHistory(1, 10);
			setTransactions(data.items || []);
		} catch (err) {
			console.error("Failed to fetch transactions:", err);
			setTransactionError(true);
			toast("Transaction Error", "Could not retrieve history", "error");
		} finally {
			setLoadingTransactions(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchWallet();
		fetchTransactions();
	}, [fetchWallet, fetchTransactions]);

  const handleActionSuccess = () => {
    fetchWallet();
		fetchTransactions();
  };

	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						My Wallet
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Manage your earnings and balance
					</p>
				</div>
				<div className="flex gap-2">
					<button 
            onClick={() => setIsFundModalOpen(true)}
            className="px-8 py-4 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
						<Plus size={16} />
						Fund Wallet
					</button>
					<button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
          >
						<CreditCard size={16} />
						Request Payout
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
				{/* Balance Section */}
				<div className="lg:col-span-4 space-y-10">
					{loadingWallet ? (
            <div className="bg-black text-white rounded p-20 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-8 h-8 text-gold animate-spin" />
               <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Loading Balance...</p>
            </div>
          ) : walletError ? (
            <div className="bg-red-50 border border-red-100 rounded p-10 text-center space-y-4">
               <AlertTriangle className="text-red-500 mx-auto" size={24} />
               <h4 className="text-[11px] font-black uppercase tracking-widest text-black">Balance Sync Error</h4>
               <button onClick={fetchWallet} className="text-[9px] font-black uppercase text-gold underline">Try Again</button>
            </div>
          ) : (
            <div className="bg-black text-white rounded p-8 lg:p-10 space-y-10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-gold/10 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/5 blur-3xl rounded-full" />

              <div className="flex items-center justify-between relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gold transition-colors">
                  Balance Overview
                </p>
                <div className="flex bg-white/10 rounded-full p-1">
                  <button
                    onClick={() => setActiveCurrency("NGN")}
                    className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${activeCurrency === "NGN" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
                  >
                    NGN
                  </button>
                  <button
                    onClick={() => setActiveCurrency("USD")}
                    className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${activeCurrency === "USD" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
                  >
                    USD
                  </button>
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black tracking-tighter mb-2">
                  {formatCurrency(wallet?.availableBalance || 0, activeCurrency)}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Available for Payout
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">
                    Balance
                  </p>
                  <p className="text-xs font-black">{formatCurrency(wallet?.balance || 0, activeCurrency)}</p>
                </div>
                <div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">
                    Pending
                  </p>
                  <p className="text-xs font-black">{formatCurrency(wallet?.pendingBalance || 0, activeCurrency)}</p>
                </div>
              </div>
            </div>
          )}

					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
							<Coins size={14} className="text-gold" />
							Shortcuts
						</h4>
						<div className="grid grid-cols-2 gap-4">
							{[
								{ label: "Pay Subs", icon: Plus },
								{ label: "Boost Ads", icon: ArrowUpRight },
								{ label: "Withdraw", icon: CreditCard, action: () => setIsWithdrawModalOpen(true) },
								{ label: "Sync", icon: Clock, action: handleActionSuccess },
							].map((action, i) => (
								<button
									key={i}
									onClick={action.action}
									className="flex flex-col items-center gap-3 p-6 rounded bg-gray-50 border border-transparent hover:border-gold hover:bg-white transition-all group"
								>
									<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-gold group-hover:scale-110 transition-all border border-transparent group-hover:border-gold/30">
										<action.icon size={18} />
									</div>
									<span className="text-[9px] font-black uppercase tracking-widest text-black">
										{action.label}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* History Section */}
				<div className="lg:col-span-8 space-y-8">
					<div className="bg-white border border-gray-100 rounded overflow-hidden transition-shadow">
						<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
							<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
								Transaction History
							</h4>
							<div className="flex flex-wrap items-center gap-3">
								<div className="relative">
									<Search
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
										size={14}
									/>
									<input
										type="text"
										placeholder="Search transactions..."
										className="bg-gray-50 rounded py-2.5 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-transparent focus:border-gold/30 transition-all"
									/>
								</div>
								<button className="px-6 py-2.5 rounded border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">
									<Filter size={14} />
									Filter
								</button>
							</div>
						</div>
						<div className="divide-y divide-gray-50 min-h-100">
							{loadingTransactions ? (
                <div className="flex flex-col items-center justify-center h-100 gap-4">
                   <Loader2 className="w-10 h-10 text-gold animate-spin" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retrieving History...</p>
                </div>
              ) : transactionError ? (
                <div className="flex flex-col items-center justify-center h-100 space-y-4">
                   <AlertTriangle className="text-amber-500" size={40} />
                   <div className="text-center">
                      <h4 className="text-lg font-black uppercase tracking-tight text-black">History Sync Failed</h4>
                      <p className="text-sm text-gray-400 mt-1">We couldn&apos;t load your recent activity.</p>
                   </div>
                   <button onClick={fetchTransactions} className="px-8 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded transition-all hover:bg-gold hover:text-black">
                     Retry Refresh
                   </button>
                </div>
              ) : transactions.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-100 space-y-4">
									<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
										<Clock size={32} />
									</div>
									<div className="text-center">
										<h4 className="text-lg font-black uppercase tracking-tight text-black">No Transactions</h4>
										<p className="text-sm text-gray-400 mt-1">Your wallet activity will be listed here.</p>
									</div>
								</div>
							) : (
								transactions.map((t, i) => {
									const isCredit = t.transactionType?.toLowerCase() === "deposit" || t.transactionType?.toLowerCase() === "earnings";
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
													<h5 className="text-[11px] font-black uppercase tracking-tight text-black group-hover:text-gold transition-colors">
														{t.transactionReference || "System Transaction"}
													</h5>
													<div className="flex items-center gap-3 mt-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
														<span>{t.transactionType}</span>
														<span className="w-1 h-1 rounded-full bg-gray-300" />
														<span>{getRelativeTime(t.transactionDate)}</span>
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
												<span className="text-[8px] font-black uppercase tracking-widest text-gray-300">
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
								<button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black border border-gray-50 rounded transition-all">
									View Full Statement
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

      {/* Modals */}
      <FundWalletModal 
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        onSuccess={handleActionSuccess}
        currency={activeCurrency}
      />

      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={handleActionSuccess}
        availableBalance={wallet?.availableBalance || 0}
        currency={activeCurrency}
      />
		</div>
	);
}
