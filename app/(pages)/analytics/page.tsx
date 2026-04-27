"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
	TrendingUp,
	Users,
	ShoppingBag,
	DollarSign,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProductStats } from "@/lib/api/services/products";
import { getMyWallet } from "@/lib/api/services/wallet";
import { getVendorOrders } from "@/lib/api/services/orders";
import { formatCurrency } from "@/lib/utils/currency";

export default function AnalyticsPage() {
	const { data: productStats, isLoading: loadingStats } = useQuery({
		queryKey: ["product-stats"],
		queryFn: getProductStats,
	});

	const { data: wallet, isLoading: loadingWallet } = useQuery({
		queryKey: ["my-wallet"],
		queryFn: getMyWallet,
	});

	const { data: ordersData, isLoading: loadingOrders } = useQuery({
		queryKey: ["vendor-orders", 1, 100],
		queryFn: () => getVendorOrders(1, 100),
	});

	const orders = ordersData || [];
	const totalRevenue = wallet?.balance || 0;
	const totalOrders = orders.length;
	const totalViews = productStats?.totalViews || 0;
	
	return (
		<div className="space-y-12">
			<PageHeader
				title="Performance Analytics"
				description="Deep dive into your store sales and performance"
				actions={
					<div className="flex bg-white border border-gray-100 rounded p-1">
						<button className="px-6 py-2 rounded hover:bg-gray-50 text-xs font-bold text-gray-400 hover:text-black transition-all">
							Today
						</button>
						<button className="px-6 py-2 rounded bg-black text-xs font-bold text-white transition-all">
							Last 7 Days
						</button>
						<button className="px-6 py-2 rounded hover:bg-gray-50 text-xs font-bold text-gray-400 hover:text-black transition-all">
							Last 30 Days
						</button>
					</div>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[
					{
						label: "Total Revenue",
						val: loadingWallet ? "..." : formatCurrency(totalRevenue),
						change: "Active Balance",
						icon: DollarSign,
						trend: "up",
					},
					{
						label: "Total Orders",
						val: loadingOrders ? "..." : totalOrders.toLocaleString(),
						change: "Processed",
						icon: ShoppingBag,
						trend: "up",
					},
					{
						label: "Total Views",
						val: loadingStats ? "..." : totalViews.toLocaleString(),
						change: "Visibility",
						icon: Users,
						trend: "up",
					},
					{
						label: "Active Listings",
						val: loadingStats ? "..." : (productStats?.activeProducts || 0).toLocaleString(),
						change: "Products",
						icon: TrendingUp,
						trend: "up",
					},
				].map((stat, i) => (
					<div
						key={i}
						className="bg-white border border-gray-100 rounded p-8 hover:border-gold transition-all group"
					>
						<div className="flex items-center justify-between mb-6">
							<div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gold group-hover:text-black transition-all">
								<stat.icon size={18} />
							</div>
						</div>
						<p className="text-xs font-bold text-gray-500 mb-2">{stat.label}</p>
						<h3 className="text-3xl font-black text-black tracking-tighter">
							{stat.val}
						</h3>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
				<div className="lg:col-span-2 space-y-10">
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-bold text-black">
								Revenue Statistics
							</h4>
							<div className="flex gap-4">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-gold" />
									<span className="text-[10px] font-bold text-gray-400">
										Current Period
									</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-gray-200" />
									<span className="text-[10px] font-bold text-gray-400">
										Previous Period
									</span>
								</div>
							</div>
						</div>
						<div className="h-64 flex items-end gap-3 px-2">
							{[40, 65, 45, 80, 55, 95, 70, 85, 60, 100, 75, 90].map((h, i) => (
								<div
									key={i}
									className="flex-1 bg-gray-50 rounded-t relative group cursor-pointer"
								>
									<div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-t" />
									<div className="absolute bottom-0 left-0 right-1.5 bg-gray-200 rounded-t h-[70%]" />
									<div
										className={`absolute bottom-0 left-0 right-1.5 rounded-t transition-all duration-1000 ${i === 9 ? "bg-gold" : "bg-black group-hover:bg-gold"}`}
										style={{ height: `${h}%` }}
									/>
									<span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 hidden lg:block">
										Day {i + 1}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-sm font-bold text-black">
							Product Performance
						</h4>
						<div className="overflow-x-auto">
							<table className="w-full text-left">
								<thead className="border-b border-gray-50">
									<tr>
										{[
											"Product",
											"Views",
											"SoldCount",
											"Revenue",
											"Conversion",
										].map((th) => (
											<th
												key={th}
												className="px-4 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
											>
												{th}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50">
									{[
										{
											name: "Premium Watch 5",
											views: "12,402",
											sold: "842",
											rev: "₦10.5M",
											conv: "6.7%",
										},
										{
											name: "Studio Headphones",
											views: "8,921",
											sold: "321",
											rev: "₦2.7M",
											conv: "3.5%",
										},
										{
											name: "Speed Sneakers",
											views: "5,821",
											sold: "156",
											rev: "₦0.7M",
											conv: "2.6%",
										},
										{
											name: "Classic Bag",
											views: "4,201",
											sold: "52",
											rev: "₦0.4M",
											conv: "1.2%",
										},
									].map((p, i) => (
										<tr
											key={i}
											className="hover:bg-gray-50/50 transition-colors"
										>
											<td className="px-4 py-5 text-sm font-bold text-black">
												{p.name}
											</td>
											<td className="px-4 py-5 text-sm font-bold text-gray-400">
												{p.views}
											</td>
											<td className="px-4 py-5 text-sm font-bold text-black">
												{p.sold}
											</td>
											<td className="px-4 py-5 text-sm font-bold text-gold">
												{p.rev}
											</td>
											<td className="px-4 py-5 text-sm font-bold text-green-600">
												{p.conv}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="space-y-10">
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-sm font-bold text-black">
							Promotion Performance
						</h4>
						<div className="space-y-8">
							{[
								{ label: "Boost Product", val: 85, color: "bg-gold" },
								{ label: "Featured Product", val: 65, color: "bg-black" },
								{ label: "Category Spotlight", val: 45, color: "bg-gray-400" },
								{ label: "Coupons", val: 30, color: "bg-gray-200" },
							].map((promo, i) => (
								<div key={i} className="space-y-3">
									<div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
										<span className="text-black">{promo.label}</span>
										<span className="text-gray-400">{promo.val}% ROI</span>
									</div>
									<div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
										<div
											className={`h-full ${promo.color} rounded-full transition-all duration-1000`}
											style={{ width: `${promo.val}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="bg-black text-white rounded p-10 space-y-10 relative overflow-hidden group">
						<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-gold/10 transition-colors" />
						<h4 className="text-sm font-bold text-gold relative z-10">
							Audience Location
						</h4>
						<div className="space-y-6 relative z-10">
							{[
								{ loc: "Lagos, Nigeria", pct: 64 },
								{ loc: "Johannesburg, SA", pct: 18 },
								{ loc: "Abuja, Nigeria", pct: 12 },
								{ loc: "Others", pct: 6 },
							].map((item, i) => (
								<div key={i} className="flex items-center justify-between">
									<span className="text-xs font-bold text-gray-400">
										{item.loc}
									</span>
									<span className="text-xs font-bold text-white">
										{item.pct}%
									</span>
								</div>
							))}
						</div>
						<button className="w-full py-4 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-gold hover:text-black transition-all relative z-10">
							View Detailed Report
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
