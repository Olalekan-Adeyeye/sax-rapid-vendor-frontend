"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { Button } from "@/components/ui/Button";
import * as walletService from "@/lib/api/services/wallet";
import {
	WalletResponseDTO,
	WalletTransactionResponseDTO,
} from "@/lib/api/types/wallet.types";
import { formatCurrency } from "@/lib/utils/currency";
import { getRelativeTime } from "@/lib/utils/date";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/ui/PageHeader";

// Modals
import { FundWalletModal } from "@/components/wallet/FundWalletModal";
import { WithdrawModal } from "@/components/wallet/WithdrawModal";

export default function WalletPage() {
	const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
	const [transactions, setTransactions] = useState<
		WalletTransactionResponseDTO[]
	>([]);

	const [loadingWallet, setLoadingWallet] = useState(true);
	const [loadingTransactions, setLoadingTransactions] = useState(true);

	const [error, setError] = useState<string | null>(null);
	const [transactionError, setTransactionError] = useState(false);

	const [activeCurrency, setActiveCurrency] = useState("NGN");

	// Modal States
	const [isFundModalOpen, setIsFundModalOpen] = useState(false);
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

	const fetchWallet = useCallback(async () => {
		try {
			setLoadingWallet(true);
			setError(null);
			const data = await walletService.getMyWallet();
			setWallet(data);
			if (data.currency) setActiveCurrency(data.currency);
		} catch (err) {
			console.error("Failed to fetch wallet:", err);
			setError(getErrorMessage(err));
		} finally {
			setLoadingWallet(false);
		}
	}, []);

	const fetchTransactions = useCallback(async () => {
		try {
			setLoadingTransactions(true);
			setTransactionError(false);
			const data = await walletService.getTransactionHistory(1, 10);
			setTransactions(data.items || []);
		} catch (err) {
			console.error("Failed to fetch transactions:", err);
			setTransactionError(true);
		} finally {
			setLoadingTransactions(false);
		}
	}, []);

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
			{loadingWallet && !wallet ? (
				<FullPageLoader label="Loading wallet..." icon={Coins} />
			) : error ? (
				<ErrorComponent
					title="Failed to load wallet"
					message={error!}
					onRetry={() => {
						fetchWallet();
						fetchTransactions();
					}}
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
								<Button
									onClick={() => setIsWithdrawModalOpen(true)}
									rounded="full"
									size="sm"
									className="px-8"
								>
									<CreditCard size={16} />
									Request Payout
								</Button>
							</>
						}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
						{/* Balance Section */}
						<div className="lg:col-span-4 space-y-10">
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
										<div className="flex justify-between bg-white/10 rounded p-1.5 gap-1">
											<Button
												onClick={() => setActiveCurrency("NGN")}
												variant={activeCurrency === "NGN" ? "primary" : "ghost"}
												size="sm"
												className={`flex w-full px-4 border-none h-8 ${activeCurrency === "NGN" ? "bg-white text-black" : "text-gray-400 hover:text-white bg-transparent"}`}
											>
												NGN
											</Button>
											<Button
												onClick={() => setActiveCurrency("USD")}
												variant={activeCurrency === "USD" ? "primary" : "ghost"}
												size="sm"
												className={`flex w-full px-4 border-none h-8 ${activeCurrency === "USD" ? "bg-white text-black" : "text-gray-400 hover:text-white bg-transparent"}`}
											>
												USD
											</Button>
										</div>
									</div>
									<div className="relative z-10">
										<h3 className="text-4xl font-black tracking-tighter mb-2">
											{formatCurrency(
												wallet?.availableBalance || 0,
												activeCurrency,
											)}
										</h3>
										<p className="text-xs font-bold text-gray-500">
											Available for Payout
										</p>
									</div>
									{/* <div className="grid grid-cols-2 gap-4 relative z-10">
										<div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors border border-white/5">
											<p className="text-[10px] font-bold text-gray-500 mb-1">
												Balance
											</p>
											<p className="text-sm font-bold">
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
									</div> */}
								</div>
							)}

							<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
								<h4 className="text-xs font-bold text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
									<Coins size={14} className="text-gold" />
									Shortcuts
								</h4>
								<div className="grid grid-cols-2 gap-4">
									{[
										{ label: "Pay Subs", icon: Plus },
										{ label: "Boost Ads", icon: ArrowUpRight },
										{
											label: "Withdraw",
											icon: CreditCard,
											action: () => setIsWithdrawModalOpen(true),
										},
										{ label: "Sync", icon: Clock, action: handleActionSuccess },
									].map((action, i) => (
										<Button
											key={i}
											onClick={action.action}
											variant="ghost"
											className="flex flex-col items-center gap-3 p-6 h-auto bg-gray-50 border-transparent hover:border-gold hover:bg-white group"
										>
											<div className="w-10 h-10 rounded bg-white flex items-center justify-center text-gray-400 group-hover:text-gold group-hover:scale-110 transition-all border border-transparent group-hover:border-gold/30">
												<action.icon size={18} />
											</div>
											<span className="text-xs font-bold text-black">
												{action.label}
											</span>
										</Button>
									))}
								</div>
							</div>
						</div>

						{/* History Section */}
						<div className="lg:col-span-8 space-y-8">
							<div className="bg-white border border-gray-100 rounded overflow-hidden transition-shadow">
								<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
									<h4 className="text-xs font-bold text-black">
										Transaction History
									</h4>
									<div className="flex flex-wrap items-center gap-3">
										<SearchInput
											placeholder="Search transactions..."
											variant="muted"
										/>
										<Button
											variant="outline"
											size="sm"
											className="px-6 py-2.5 text-gray-400 hover:text-black"
										>
											<Filter size={14} />
											Filter
										</Button>
									</div>
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
												onClick={fetchTransactions}
												variant="black"
												size="md"
												className="px-8 mt-4"
											>
												Retry Refresh
											</Button>
										</div>
									) : transactions.length === 0 ? (
										<div className="flex flex-col items-center justify-center h-100 space-y-4">
											<div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center text-gray-300 mx-auto">
												<Clock size={32} />
											</div>
											<div className="text-center">
												<h4 className="text-lg font-black uppercase tracking-tight text-black">
													No Transactions
												</h4>
												<p className="text-sm text-gray-400 mt-1">
													Your wallet activity will be listed here.
												</p>
											</div>
										</div>
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
