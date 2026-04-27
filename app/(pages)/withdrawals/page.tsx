"use client";
import React from "react";
import {
	ArrowDownCircle,
	MoreVertical,
	CreditCard,
	Banknote,
	Clock,
	CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyWallet, getTransactionHistory } from "@/lib/api/services/wallet";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Loader2 } from "lucide-react";

import { WithdrawModal } from "@/components/wallet/WithdrawModal";

export default function PayoutsPage() {
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");

	const { data: wallet, isLoading: loadingWallet } = useQuery({
		queryKey: ["my-wallet"],
		queryFn: getMyWallet,
	});

	const { data: transactionsData, isLoading: loadingTransactions } = useQuery({
		queryKey: ["wallet-transactions"],
		queryFn: () => getTransactionHistory(1, 100),
	});

	const withdrawals = (transactionsData?.items || []).filter(
		(t) => t.transactionType?.toLowerCase() === "withdrawal" || t.transactionType?.toLowerCase() === "payout"
	);

	const filteredWithdrawals = withdrawals.filter((w) => 
		w.transactionReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
		(w.id && w.id.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const stats = [
		{
			label: "Available Balance",
			value: wallet?.availableBalance || 0,
			detail: "Ready for payout",
			icon: Banknote,
			color: "text-gold",
		},
		{
			label: "Pending Balance",
			value: wallet?.pendingBalance || 0,
			detail: "Awaiting settlement",
			icon: Clock,
			color: "text-gray-400",
		},
		{
			label: "Total Balance",
			value: wallet?.balance || 0,
			detail: "Lifetime earnings",
			icon: CheckCircle,
			color: "text-green-500",
		},
	];

	return (
		<div className="space-y-10">
			<PageHeader
				title="Withdrawals"
				description="Request and track your payouts to your bank account"
				actions={
					<Button
						onClick={() => setIsWithdrawModalOpen(true)}
						rounded="full"
						size="sm"
						className="px-8 py-3.5"
					>
						<ArrowDownCircle size={16} />
						Request Withdrawal
					</Button>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{stats.map((stat, i) => (
					<div
						key={i}
						className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-gold transition-all group"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gold group-hover:text-black transition-all">
								<stat.icon size={20} />
							</div>
						</div>
						<p className="text-xs font-bold text-gray-500 mb-1 transition-colors">
							{stat.label}
						</p>
						<h3
							className={`text-2xl lg:text-3xl font-black tracking-tighter mb-2 ${stat.color}`}
						>
							{loadingWallet ? "..." : formatCurrency(stat.value)}
						</h3>
						<p className="text-[10px] font-bold text-gray-400">{stat.detail}</p>
					</div>
				))}
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<h4 className="text-sm font-bold text-black">Payout Methods</h4>
					<button className="text-xs font-bold text-gold hover:underline transition-all">
						+ Add Bank Account
					</button>
				</div>
				<div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
					{[
						{
							bank: "Guaranty Trust Bank",
							account: "**** 8291",
							holder: "TechWorld Enterprise",
							status: "Primary",
						},
					].map((method, i) => (
						<div
							key={i}
							className="bg-gray-50/50 border border-gray-100 rounded p-6 flex items-center justify-between group hover:border-black hover:bg-white transition-all"
						>
							<div className="flex items-center gap-6">
								<div className="w-12 h-12 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
									<CreditCard size={20} />
								</div>
								<div>
									<h5 className="text-sm font-bold text-black">
										{method.bank}
									</h5>
									<p className="text-xs font-bold text-gray-400 mt-1">
										{method.account} · {method.holder}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-xs font-bold px-2.5 py-1.5 rounded bg-white border border-gray-100 text-gray-400 group-hover:border-black group-hover:text-black transition-all">
									{method.status}
								</span>
								<button className="text-gray-300 hover:text-black transition-colors">
									<MoreVertical size={16} />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<h4 className="text-sm font-bold text-black uppercase tracking-widest">Payout History</h4>
					<div className="flex flex-wrap items-center gap-3">
						<SearchInput
							placeholder="Search payouts..."
							variant="muted"
							focusColor="gold"
							value={searchQuery}
							onChange={setSearchQuery}
						/>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left min-w-250">
						<thead className="bg-gray-50 border-b border-gray-100">
							<tr>
								{[
									"Payout ID",
									"Amount",
									"Reference",
									"Status",
									"Date",
								].map((th) => (
									<th
										key={th}
										className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
									>
										{th}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{loadingTransactions ? (
								<tr>
									<td colSpan={5} className="px-8 py-20 text-center">
										<Loader2 className="animate-spin text-gold mx-auto mb-4" size={40} />
										<p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading History...</p>
									</td>
								</tr>
							) : filteredWithdrawals.length > 0 ? (
								filteredWithdrawals.map((p, index) => (
									<tr key={p.id || `payout-${index}`} className="hover:bg-gray-50/50 transition-colors group">
										<td className="px-8 py-5 text-xs font-black text-black">
											#{p.id ? p.id.slice(0, 8) : "N/A"}
										</td>
										<td className="px-8 py-5 text-xs font-black text-black">
											{formatCurrency(p.amount)}
										</td>
										<td className="px-8 py-5 text-xs font-bold text-gray-400">
											{p.transactionReference || "SYSTEM-PAY"}
										</td>
										<td className="px-8 py-5">
											<span
												className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${
													p.status === "Completed"
														? "bg-green-50 text-green-600"
														: "bg-blue-50 text-blue-600"
												}`}
											>
												{p.status}
											</span>
										</td>
										<td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
											{formatDate(p.transactionDate)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className="px-8 py-20 text-center">
										<div className="w-16 h-16 rounded bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 mx-auto mb-4">
											<Banknote size={32} />
										</div>
										<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
											No payout records found
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<WithdrawModal 
				isOpen={isWithdrawModalOpen}
				onClose={() => setIsWithdrawModalOpen(false)}
				onSuccess={() => {
					// Invalidate queries
				}}
				availableBalance={wallet?.availableBalance || 0}
				currency={wallet?.currency || "NGN"}
			/>
		</div>
	);
}
