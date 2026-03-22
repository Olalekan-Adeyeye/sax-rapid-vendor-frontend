"use client";
import React, { useState } from "react";
import { Wallet, Plus, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, Search, Filter, HelpCircle, DollarSign, Coins } from "lucide-react";

export default function WalletPage() {
	const [activeCurrency, setActiveCurrency] = useState("NGN");

	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black uppercase">
						My Wallet
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Manage your earnings and balance
					</p>
				</div>
				<div className="flex gap-2">
					<button className="px-8 py-4 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
						<Plus size={16} />
						Fund Wallet
					</button>
					<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-none">
						<CreditCard size={16} />
						Request Payout
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
				{/* Balance Section */}
				<div className="lg:col-span-4 space-y-10">
					<div className="bg-black text-white rounded p-8 lg:p-10 space-y-10 relative overflow-hidden group">
						<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-gold/10 transition-colors" />
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/5 blur-3xl rounded-full" />
						
						<div className="flex items-center justify-between relative z-10">
							<p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gold transition-colors">Balance Overview</p>
							<div className="flex bg-white/10 rounded-full p-1 overflow-hidden">
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
							<h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-2">
								{activeCurrency === "NGN" ? "₦" : "$" }14,247,500
							</h3>
							<p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Available across all methods</p>
						</div>
						<div className="grid grid-cols-2 gap-4 relative z-10">
							<div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors">
								<p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Available</p>
								<p className="text-xs font-black">₦12,850,000</p>
							</div>
							<div className="bg-white/5 rounded p-4 group-hover:bg-white/10 transition-colors">
								<p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Pending</p>
								<p className="text-xs font-black">₦1,397,500</p>
							</div>
						</div>
					</div>

					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
							<Coins size={14} className="text-gold" />
							Quick Actions
						</h4>
						<div className="grid grid-cols-2 gap-4">
							{[
								{ label: "Pay Subs", icon: Plus },
								{ label: "Boost Ads", icon: ArrowUpRight },
								{ label: "Pay Fees", icon: CreditCard },
								{ label: "Transfer", icon: ArrowDownLeft }
							].map((action, i) => (
								<button key={i} className="flex flex-col items-center gap-3 p-6 rounded bg-gray-50 border border-transparent hover:border-gold hover:bg-white transition-all group">
									<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-gold group-hover:scale-110 transition-all border border-transparent group-hover:border-gold/30">
										<action.icon size={18} />
									</div>
									<span className="text-[9px] font-black uppercase tracking-widest text-black">{action.label}</span>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* History Section */}
				<div className="lg:col-span-8 space-y-8">
					<div className="bg-white border border-gray-100 rounded overflow-hidden shadow-sm hover:shadow-none transition-shadow">
						<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
							<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Transaction History</h4>
							<div className="flex flex-wrap items-center gap-3">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
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
						<div className="divide-y divide-gray-50">
							{[
								{ title: "Payout to GTBank Account", type: "Withdrawal", amount: "₦450,000", status: "Completed", date: "Today, 10:45 AM", icon: ArrowUpRight, sign: "-" },
								{ title: "Subscription Payment - Premium Plan", type: "Subscription", amount: "₦25,000", status: "Completed", date: "Mar 17, 2026", icon: Clock, sign: "-" },
								{ title: "Sale: Premium Watch 5 #8291", type: "Earnings", amount: "₦125,000", status: "Completed", date: "Mar 16, 2026", icon: ArrowDownLeft, sign: "+" },
								{ title: "Boost Ads: Featured Item", type: "Marketing", amount: "₦5,000", status: "Completed", date: "Mar 15, 2026", icon: Clock, sign: "-" },
							].map((t, i) => (
								<div key={i} className="p-6 lg:p-8 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
									<div className="flex items-center gap-6">
										<div className={`w-12 h-12 rounded bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all ${t.sign === '+' ? 'text-green-500' : 'text-red-500'}`}>
											<t.icon size={20} />
										</div>
										<div>
											<h5 className="text-[11px] font-black uppercase tracking-tight text-black group-hover:text-gold transition-colors">{t.title}</h5>
											<div className="flex items-center gap-3 mt-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
												<span>{t.type}</span>
												<span className="w-1 h-1 rounded-full bg-gray-300" />
												<span>{t.date}</span>
											</div>
										</div>
									</div>
									<div className="text-right">
										<p className={`text-sm font-black mb-1 ${t.sign === '+' ? 'text-green-500' : 'text-black'}`}>{t.sign}{t.amount}</p>
										<span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Transaction ID: TXN-4921-X</span>
									</div>
								</div>
							))}
						</div>
						<div className="p-8 border-t border-gray-50">
							<button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black border border-gray-50 rounded transition-all">
								View Full Statement
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
