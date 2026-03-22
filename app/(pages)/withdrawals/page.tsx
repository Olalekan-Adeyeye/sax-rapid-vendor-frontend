"use client";
import React from "react";
import { ArrowDownCircle, Search, MoreVertical, CreditCard, Banknote, Clock, CheckCircle } from "lucide-react";

export default function PayoutsPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black uppercase">
						Withdrawals
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Request and track your payouts to your bank account
					</p>
				</div>
				<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
					<ArrowDownCircle size={16} />
					Request Withdrawal
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[
					{ label: "Available Balance", value: "₦12,850,000", detail: "Ready for payout", icon: Banknote, color: "text-gold" },
					{ label: "Pending Balance", value: "₦1,397,500", detail: "Awaiting settlement", icon: Clock, color: "text-gray-400" },
					{ label: "Last Payout", value: "₦450,000", detail: "Paid Mar 18, 2026", icon: CheckCircle, color: "text-green-500" }
				].map((stat, i) => (
					<div key={i} className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-gold/20 transition-all group">
						<div className="flex items-start justify-between mb-4">
							<div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gold group-hover:text-black transition-all">
								<stat.icon size={20} />
							</div>
						</div>
						<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 group-hover:text-gold transition-colors">{stat.label}</p>
						<h3 className={`text-2xl lg:text-3xl font-black tracking-tighter mb-2 ${stat.color}`}>{stat.value}</h3>
						<p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{stat.detail}</p>
					</div>
				))}
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Payout Methods</h4>
					<button className="text-[9px] font-black uppercase tracking-widest text-gold">+ Add Bank Account</button>
				</div>
				<div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
					{[
						{ bank: "Guaranty Trust Bank", account: "**** 8291", holder: "TechWorld Enterprise", status: "Primary" },
						{ bank: "Zenith Bank PLC", account: "**** 3810", holder: "TechWorld Enterprise", status: "Secondary" }
					].map((method, i) => (
						<div key={i} className="bg-gray-50/50 border border-gray-100 rounded p-6 flex items-center justify-between group hover:border-gold/30 hover:bg-white transition-all">
							<div className="flex items-center gap-6">
								<div className="w-12 h-12 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
									<CreditCard size={20} />
								</div>
								<div>
									<h5 className="text-[11px] font-black uppercase tracking-tight text-black">{method.bank}</h5>
									<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{method.account} · {method.holder}</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-white border border-gray-100 text-gray-300 group-hover:border-gold group-hover:text-gold transition-all">{method.status}</span>
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
					<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Payout History</h4>
					<div className="flex flex-wrap items-center gap-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
							<input 
								type="text" 
								placeholder="Search payouts..." 
								className="bg-gray-50 rounded py-2.5 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-transparent focus:border-gold/30 transition-all"
							/>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left min-w-250">
						<thead className="bg-gray-50 border-b border-gray-100">
							<tr>
								{["Payout ID", "Method", "Amount", "Reference", "Status", "Date"].map((th) => (
									<th key={th} className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{th}</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{[
								{ id: "#PO-4921", bank: "GTBank · **** 8291", amount: "₦450,000", ref: "RAPID-PAY-9821-X", status: "Completed", date: "Mar 18, 2026" },
								{ id: "#PO-4918", bank: "GTBank · **** 8291", amount: "₦1,250,500", ref: "RAPID-PAY-9812-Y", status: "Completed", date: "Mar 11, 2026" },
								{ id: "#PO-4915", bank: "Zenith Bank · **** 3810", amount: "₦680,200", ref: "RAPID-PAY-9801-Z", status: "Processing", date: "Mar 04, 2026" },
							].map((p, i) => (
								<tr key={i} className="hover:bg-gray-50/50 transition-colors">
									<td className="px-8 py-5 text-sm font-black text-black">{p.id}</td>
									<td className="px-8 py-5 text-xs font-black text-black uppercase tracking-tight">{p.bank}</td>
									<td className="px-8 py-5 text-xs font-black text-black">{p.amount}</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">{p.ref}</td>
									<td className="px-8 py-5">
										<span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
											p.status === 'Completed' ? 'bg-green-50 text-green-600' : 
											'bg-blue-50 text-blue-600'
										}`}>
											{p.status}
										</span>
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">{p.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
