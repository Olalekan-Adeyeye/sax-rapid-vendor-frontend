"use client";
import React from "react";
import { Plus, Search, Tag } from "lucide-react";

export default function PromotionsPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Promotions
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Create discount coupons and marketing campaigns
					</p>
				</div>
				<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
					<Plus size={16} />
					Create Campaign
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{[
					{
						title: "Discount Coupons",
						desc: "Create percentage or fixed amount discounts for your customers.",
						icon: Tag,
						color: "bg-gold/10",
						action: "New Coupon",
					},
					{
						title: "Promotional Campaigns",
						desc: "Launch time-limited store wide sales or seasonal events.",
						icon: Rocket,
						color: "bg-black text-white",
						action: "Start Campaign",
					},
					{
						title: "Featured Products",
						desc: "Organize products manually for your store home page.",
						icon: Star,
						color: "bg-gray-50",
						action: "Configure",
					},
				].map((promo, i) => (
					<div
						key={i}
						className={`p-8 lg:p-10 rounded border border-gray-100 flex flex-col justify-between group hover:border-gold/30 transition-all ${promo.color === "bg-black text-white" ? "bg-black text-white" : "bg-white text-black"}`}
					>
						<div className="mb-10">
							<div
								className={`w-14 h-14 rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${promo.color === "bg-black text-white" ? "bg-white/10 text-gold" : "bg-gold/10 text-gold"}`}
							>
								<promo.icon size={24} />
							</div>
							<h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">
								{promo.title}
							</h3>
							<p className="text-[10px] font-medium leading-relaxed opacity-60">
								{promo.desc}
							</p>
						</div>
						<button
							className={`w-full py-4 rounded text-[9px] font-black uppercase tracking-widest transition-all ${
								promo.color === "bg-black text-white"
									? "bg-white text-black hover:bg-gold"
									: "border border-gray-100 hover:border-gold hover:text-gold"
							}`}
						>
							{promo.action}
						</button>
					</div>
				))}
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
						Active Promotions
					</h4>
					<div className="flex flex-wrap items-center gap-3">
						<div className="relative">
							<Search
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={14}
							/>
							<input
								type="text"
								placeholder="Search promotions..."
								className="bg-gray-50 rounded py-2.5 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-transparent focus:border-gold/30 transition-all"
							/>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left min-w-250">
						<thead className="bg-gray-50 border-b border-gray-100">
							<tr>
								{[
									"Campaign Name",
									"Type",
									"Value",
									"Usage",
									"Status",
									"End Date",
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
									name: "EASTER-SALE-2026",
									type: "Coupon",
									val: "15% OFF",
									used: "124/500",
									status: "Active",
									date: "Apr 15, 2026",
								},
								{
									name: "New Store Launch",
									type: "Campaign",
									val: "Storewide",
									used: "N/A",
									status: "Active",
									date: "Mar 30, 2026",
								},
								{
									name: "WELCOME-RAPID",
									type: "Coupon",
									val: "₦5,000",
									used: "52/Unlimited",
									status: "Active",
									date: "No Expiry",
								},
								{
									id: "FLASH-2026",
									type: "Campaign",
									val: "25% OFF",
									used: "0",
									status: "Draft",
									date: "N/A",
								},
							].map((p, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 transition-colors group"
								>
									<td className="px-8 py-5 text-xs font-black text-black">
										{p.name}
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
										{p.type}
									</td>
									<td className="px-8 py-5 text-xs font-black text-gold">
										{p.val}
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">
										{p.used}
									</td>
									<td className="px-8 py-5">
										<span
											className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
												p.status === "Active"
													? "bg-green-50 text-green-600"
													: "bg-gray-100 text-gray-400"
											}`}
										>
											{p.status}
										</span>
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
										{p.date}
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
import { Rocket, Star } from "lucide-react";
