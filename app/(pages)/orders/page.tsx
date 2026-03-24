"use client";
import { useState } from "react";
import {
	ShoppingBag,
	Search,
	Filter,
	MoreVertical,
	Eye,
	Truck,
} from "lucide-react";

export default function OrdersPage() {
	const [activeTab, setActiveTab] = useState("All Orders");

	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Customer Orders
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Manage and track all customer purchases
					</p>
				</div>
				<button className="px-8 py-4 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
					<ShoppingBag size={16} />
					Export Orders
				</button>
			</div>

			<div className="flex flex-wrap gap-4 lg:gap-8 pb-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
				{[
					"All Orders",
					"New",
					"Processing",
					"Completed",
					"Cancelled",
					"Returns",
				].map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`text-[10px] font-black uppercase tracking-widest pb-3 px-1 transition-all relative shrink-0 ${
							activeTab === tab ? "text-gold" : "text-gray-400 hover:text-black"
						}`}
					>
						{tab}
						{activeTab === tab && (
							<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
						)}
					</button>
				))}
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="relative flex-1 max-w-md">
						<Search
							className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
							size={16}
						/>
						<input
							type="text"
							placeholder="Search by order ID, customer name..."
							className="w-full bg-gray-50 rounded py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-transparent focus:border-gold/30 transition-all"
						/>
					</div>
					<div className="flex items-center gap-3">
						<button className="px-6 py-3 rounded border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">
							<Filter size={14} />
							Advanced Filter
						</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left min-w-250">
						<thead className="bg-gray-50 border-b border-gray-100">
							<tr>
								{[
									"Order ID",
									"Customer",
									"Items",
									"Amount",
									"Status",
									"Date",
									"",
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
							{[
								{
									id: "#8291",
									customer: "John Doe",
									items: "Premium Watch 5 · 1 unit",
									amount: "₦125,000",
									status: "New",
									date: "Today, 10:45 AM",
								},
								{
									id: "#8288",
									customer: "Sarah Smith",
									items: "Studio Headphones · 2 units",
									amount: "₦170,000",
									status: "Processing",
									date: "Mar 17, 2026",
								},
								{
									id: "#8285",
									customer: "Michael Obi",
									items: "Speed Sneakers · 1 unit",
									amount: "₦45,000",
									status: "Completed",
									date: "Mar 16, 2026",
								},
								{
									id: "#8282",
									customer: "Jessica Brown",
									items: "Dashed Fragrance · 1 unit",
									amount: "₦25,000",
									status: "Cancelled",
									date: "Mar 15, 2026",
								},
								{
									id: "#8279",
									customer: "David Wilson",
									items: "Classic Watch · 1 unit",
									amount: "₦85,000",
									status: "Returns",
									date: "Mar 14, 2026",
								},
							].map((order, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 transition-colors group"
								>
									<td className="px-8 py-5 text-sm font-black text-black">
										{order.id}
									</td>
									<td className="px-8 py-5">
										<div className="flex flex-col">
											<span className="text-xs font-black text-black uppercase tracking-tight">
												{order.customer}
											</span>
											<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
												Verified Buyer
											</span>
										</div>
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase">
										{order.items}
									</td>
									<td className="px-8 py-5 text-xs font-black text-black">
										{order.amount}
									</td>
									<td className="px-8 py-5">
										<span
											className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
												order.status === "New"
													? "bg-gold/10 text-gold"
													: order.status === "Processing"
														? "bg-blue-50 text-blue-600"
														: order.status === "Completed"
															? "bg-green-50 text-green-600"
															: order.status === "Cancelled"
																? "bg-red-50 text-red-600"
																: "bg-gray-100 text-gray-400"
											}`}
										>
											{order.status}
										</span>
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
										{order.date}
									</td>
									<td className="px-8 py-5 text-right">
										<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="w-9 h-9 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-gold transition-all">
												<Eye size={14} />
											</button>
											<button className="w-9 h-9 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-gold transition-all">
												<Truck size={14} />
											</button>
											<button className="w-9 h-9 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-gold transition-all">
												<MoreVertical size={14} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
