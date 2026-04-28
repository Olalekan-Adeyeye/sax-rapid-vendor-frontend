"use client";
import React from "react";
import {
	TrendingUp,
	ShoppingBag,
	DollarSign,
	Eye,
	Bell,
	ArrowUpRight,
	MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

import Image from "next/image";
import Link from "next/link";
import { getNotifications } from "@/lib/api/services/notifications";
import { getVendorOrders } from "@/lib/api/services/orders";
import { getProductStats } from "@/lib/api/services/products";
import { getMyWallet } from "@/lib/api/services/wallet";
import { OrderStatus } from "@/lib/api/types/orders.types";
import { getRelativeTime, formatDate } from "@/lib/utils/date";
import { PageHeader } from "@/components/ui/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils/currency";

function StatCard({
	title,
	value,
	detail,
	icon: Icon,
	variant = "light",
}: {
	title: string;
	value: string;
	detail: string;
	trend?: string;
	icon: React.ElementType;
	variant?: "light" | "dark";
}) {
	const isDark = variant === "dark";

	return (
		<div
			className={`rounded p-6 transition-all duration-300 group border h-full flex flex-col justify-between ${
				isDark
					? "bg-black border-black text-white hover:border-gold/40"
					: "bg-white border-gray-100 text-black hover:bg-gold hover:border-gold"
			}`}
		>
			<div>
				<div className="flex items-start justify-between mb-4">
					<div
						className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
							isDark
								? "bg-white/10 text-gold group-hover:bg-gold group-hover:text-black"
								: "bg-gray-50 text-gray-400 group-hover:bg-black/10 group-hover:text-black"
						}`}
					>
						<Icon size={20} />
					</div>
				</div>
				<p
					className={`text-xs font-bold mb-1.5 transition-colors duration-300 ${
						isDark
							? "text-gray-500 group-hover:text-gold"
							: "text-gray-500 group-hover:text-black/70"
					}`}
				>
					{title}
				</p>
				<h3
					className={`text-2xl lg:text-3xl font-black tracking-tighter mb-2 transition-colors duration-300 ${
						!isDark && "group-hover:text-black"
					}`}
				>
					{value}
				</h3>
			</div>
			<p
				className={`text-[10px] font-bold transition-colors duration-300 ${
					isDark ? "text-gray-500" : "text-gray-500 group-hover:text-black/60"
				}`}
			>
				{detail}
			</p>
		</div>
	);
}

function ProductViewCard({
	image,
	name,
	views,
	change,
}: {
	image: string;
	name: string;
	views: string;
	change: string;
}) {
	return (
		<div className="bg-white border border-gray-100 rounded overflow-hidden group hover:border-gold hover:shadow-lg transition-all">
			<div className="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-gray-200">
					<div className="w-1/3 h-1/3 relative opacity-20 filter grayscale brightness-0">
						<Image
							src="/assets/icons/SaxRapid-Logo.png"
							alt="Placeholder"
							fill
							className="object-contain"
						/>
					</div>
				</div>
				<Image
					src={image}
					alt={name}
					fill
					className="object-cover group-hover:scale-105 transition-transform duration-700 relative z-10"
				/>
				<div className="absolute top-3 right-3 z-20">
					<div className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-black hover:bg-gold transition-colors shadow-sm">
						<ArrowUpRight size={14} />
					</div>
				</div>
			</div>
			<div className="p-4">
				<p className="text-[10px] font-bold text-gray-400 mb-1">Product View</p>
				<h4 className="text-sm font-bold text-black tracking-tight mb-2 truncate">
					{name}
				</h4>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5 text-black">
						<Eye size={12} className="text-gold" />
						<span className="text-sm font-bold">{views}</span>
					</div>
					<span className="text-xs font-bold text-green-600">+{change}%</span>
				</div>
			</div>
		</div>
	);
}

export default function DashboardOverview() {
	// Queries
	const {
		data: orders,
		isLoading: loadingOrders,
		error: ordersError,
		refetch: refetchOrders,
	} = useQuery({
		queryKey: ["vendor-orders", 1, 5],
		queryFn: () => getVendorOrders(1, 5),
	});

	const {
		data: notificationsData,
		isLoading: loadingNotifications,
		error: notificationsError,
		refetch: refetchNotifications,
	} = useQuery({
		queryKey: ["notifications", 1, 4],
		queryFn: () => getNotifications(1, 4),
	});

	const {
		data: wallet,
		isLoading: loadingWallet,
	} = useQuery({
		queryKey: ["vendor-wallet"],
		queryFn: getMyWallet,
	});

	const {
		data: productStats,
		isLoading: loadingStats,
	} = useQuery({
		queryKey: ["product-stats"],
		queryFn: getProductStats,
	});

	const notifications = notificationsData?.items || [];
	const latestOrders = orders || [];

	const getStatusColor = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.Processing:
				return "text-blue-600 bg-blue-50";
			case OrderStatus.Delivered:
				return "text-green-600 bg-green-50";
			case OrderStatus.Pending:
				return "text-gold bg-gold/10";
			case OrderStatus.Cancelled:
			case OrderStatus.Failed:
				return "text-red-600 bg-red-50";
			case OrderStatus.Shipped:
				return "text-purple-600 bg-purple-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	return (
		<div className="space-y-10 lg:space-y-14">
			{/* Welcome Info */}
			<PageHeader
				title="Vendor Performance"
				description="Live Dashboard Overview"
				actions={
					<>
						<Button
							variant="outline"
							rounded="full"
							size="sm"
							className="font-bold flex-1 sm:flex-none whitespace-nowrap"
						>
							Generate Report
						</Button>
						<Button
							variant="primary"
							rounded="full"
							size="sm"
							className="font-bold flex-1 sm:flex-none whitespace-nowrap"
						>
							Withdraw Funds
						</Button>
					</>
				}
			/>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
				<StatCard
					icon={TrendingUp}
					title="Wallet Balance"
					value={loadingWallet ? "..." : formatCurrency(wallet?.balance || 0)}
					detail="Available for withdrawal"
					variant="dark"
				/>
				<StatCard
					icon={Eye}
					title="Product Views"
					value={
						loadingStats
							? "..."
							: (productStats?.totalViews || 0).toLocaleString()
					}
					detail="Total visibility"
				/>
				<StatCard
					icon={ShoppingBag}
					title="Total Products"
					value={
						loadingStats
							? "..."
							: (productStats?.totalProducts || 0).toLocaleString()
					}
					detail="Listed in marketplace"
				/>
				<StatCard
					icon={DollarSign}
					title="Pending Funds"
					value={
						loadingWallet ? "..." : formatCurrency(wallet?.pendingBalance || 0)
					}
					detail="Escrow / Processing"
				/>
			</div>

			{/* Main Content Area */}
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
				{/* Product Views Section */}
				<div className="xl:col-span-2 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Eye size={18} className="text-gold" />
							<h4 className="text-sm font-bold text-black">
								Top Product Views
							</h4>
						</div>
						<Link
							href="/notifications"
							className="text-xs font-bold text-gray-400 hover:text-gold transition-colors"
						>
							View Analytics
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<ProductViewCard
							image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
							name="Premium Watch 5"
							views="1,204"
							change="12"
						/>
						<ProductViewCard
							image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
							name="Studio Headphones"
							views="842"
							change="8"
						/>
						<ProductViewCard
							image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
							name="Speed Sneakers"
							views="731"
							change="24"
						/>
						<ProductViewCard
							image="https://images.unsplash.com/photo-1585333127302-3f8d9560f63b?w=400&h=400&fit=crop"
							name="Dashed Fragrance"
							views="652"
							change="15"
						/>
					</div>
				</div>

				{/* Notifications Section */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Bell size={18} className="text-gold" />
							<h4 className="text-sm font-bold text-black">Latest Updates</h4>
						</div>
						<Link
							href="/notifications"
							className="text-xs font-bold text-gray-400 hover:text-gold transition-colors"
						>
							See All
						</Link>
					</div>

					<div className="bg-white border border-gray-100 rounded divide-y divide-gray-50 overflow-hidden min-h-75 flex flex-col">
						{notificationsError ? (
							<div className="p-10 text-center flex-1 flex flex-col items-center justify-center space-y-3">
								<p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
									Failed to load updates
								</p>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => refetchNotifications()}
									className="text-[9px] font-black uppercase text-gold hover:text-black h-auto p-0 border-none"
								>
									Retry
								</Button>
							</div>
						) : loadingNotifications ? (
							[1, 2, 3, 4].map((i) => (
								<div key={i} className="p-5 animate-pulse">
									<div className="flex items-start gap-4">
										<div className="w-2 h-2 rounded-full mt-1.5 bg-gray-100 shrink-0" />
										<div className="flex-1 space-y-2">
											<div className="h-3 bg-gray-50 rounded w-1/2" />
											<div className="h-2 bg-gray-50 rounded w-full" />
										</div>
									</div>
								</div>
							))
						) : notifications?.length > 0 ? (
							notifications.map((item) => (
								<div
									key={item.id}
									className={`p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer relative overflow-hidden ${!item.isRead ? "bg-gold/2" : ""}`}
								>
									<div className="flex items-start gap-4">
										<div
											className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
												item.type === "Warning"
													? "bg-red-500"
													: item.type === "Wallet"
														? "bg-green-500"
														: "bg-gold"
											} ${item.isRead ? "opacity-30" : ""}`}
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<h5
													className={`text-[11px] tracking-tight truncate ${!item.isRead ? "font-black text-black" : "font-bold text-gray-500"}`}
												>
													{item.title}
												</h5>
												<span className="text-[8px] font-bold text-gray-400 uppercase font-mono">
													{getRelativeTime(item.createdAt)}
												</span>
											</div>
											<p
												className={`text-[10px] font-medium leading-relaxed line-clamp-2 ${!item.isRead ? "text-gray-700" : "text-gray-400"}`}
											>
												{item.message}
											</p>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="p-10 text-center flex-1 flex items-center justify-center">
								<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
									No new updates
								</p>
							</div>
						)}
					</div>
					<Button
						asChild
						variant="outline"
						rounded="full"
						size="sm"
						fullWidth
						className="text-gray-400 hover:text-black hover:bg-gray-50/50 py-4"
					>
						<Link href="/notifications">View All Notifications</Link>
					</Button>
				</div>
			</div>

			{/* Secondary Stats/Activity */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
				<div className="bg-white border border-gray-100 rounded p-6">
					<div className="flex items-center justify-between mb-8">
						<h4 className="text-xs font-bold text-black">
							Revenue Performance
						</h4>
						<select className="bg-transparent text-xs font-bold text-gray-400 outline-none cursor-pointer hover:text-black transition-colors">
							<option>Last 12 Months</option>
							<option>Last 6 Months</option>
						</select>
					</div>
					<div className="h-48 relative w-full group">
						<svg
							viewBox="0 0 1200 300"
							className="w-full h-full overflow-visible drop-shadow-[0_10px_10px_rgba(239,191,4,0.05)]"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#EFBF04" stopOpacity="0.15" />
									<stop offset="100%" stopColor="#EFBF04" stopOpacity="0" />
								</linearGradient>
							</defs>

							{/* Grid lines */}
							<line
								x1="0"
								y1="0"
								x2="1200"
								y2="0"
								stroke="#f1f5f9"
								strokeWidth="1"
							/>
							<line
								x1="0"
								y1="100"
								x2="1200"
								y2="100"
								stroke="#f1f5f9"
								strokeWidth="1"
							/>
							<line
								x1="0"
								y1="200"
								x2="1200"
								y2="200"
								stroke="#f1f5f9"
								strokeWidth="1"
							/>
							<line
								x1="0"
								y1="300"
								x2="1200"
								y2="300"
								stroke="#f1f5f9"
								strokeWidth="1"
							/>

							{/* Area Fill */}
							<path
								d="M0,300 L0,220 L100,180 L200,230 L300,140 L400,180 L500,80 L600,140 L700,90 L800,160 L900,40 L1000,100 L1100,60 L1200,120 L1200,300 Z"
								fill="url(#chartGradient)"
							/>

							{/* The Line */}
							<path
								d="M0,220 L100,180 L200,230 L300,140 L400,180 L500,80 L600,140 L700,90 L800,160 L900,40 L1000,100 L1100,60 L1200,120"
								fill="none"
								stroke="#EFBF04"
								strokeWidth="4"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="animate-[LOADING-ANIMATION-OR-STRETCH]"
							/>

							{/* Active Marker Points */}
							{[
								{ x: 0, y: 220 },
								{ x: 500, y: 80 },
								{ x: 900, y: 40 },
								{ x: 1200, y: 120 },
							].map((p, i) => (
								<circle
									key={i}
									cx={p.x}
									cy={p.y}
									r="5"
									fill="white"
									stroke="#EFBF04"
									strokeWidth="2"
									className="transition-all duration-300"
								/>
							))}
						</svg>

						{/* X-Axis Labels */}
						<div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-300">
							{["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"].map((m) => (
								<span key={m}>{m}</span>
							))}
						</div>
					</div>
				</div>

				<div className="bg-white border border-gray-100 rounded p-6">
					<div className="flex items-center justify-between mb-8">
						<h4 className="text-xs font-bold text-black">Popular Categories</h4>
						<MoreVertical size={14} className="text-gray-400 cursor-pointer" />
					</div>
					<div className="space-y-6">
						{[
							{ name: "Electronics", val: 85 },
							{ name: "Fast Fashion", val: 65 },
							{ name: "Home Living", val: 45 },
							{ name: "Beauty", val: 30 },
						].map((cat, i) => (
							<div key={i} className="space-y-2">
								<div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
									<span className="text-black">{cat.name}</span>
									<span className="text-gray-400">{cat.val}%</span>
								</div>
								<div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
									<div
										className="h-full bg-gold rounded-full transition-all duration-1000"
										style={{ width: `${cat.val}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Latest Orders Table */}
			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-6 border-b border-gray-100 flex items-center justify-between">
					<h4 className="text-xs font-bold text-black">Latest Orders</h4>
					<Link
						href="/orders"
						className="text-xs font-bold text-gold hover:text-black transition-colors"
					>
						View All
					</Link>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className="bg-gray-50/50">
							<tr>
								{[
									"Order ID",
									"Customer",
									"Product",
									"Amount",
									"Date",
									"Status",
									"",
								].map((th) => (
									<th
										key={th}
										className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap"
									>
										{th}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{ordersError ? (
								<tr>
									<td colSpan={7} className="px-8 py-20 text-center">
										<div className="flex flex-col items-center justify-center space-y-3">
											<p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
												Failed to load orders
											</p>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => refetchOrders()}
												className="text-[9px] font-black uppercase text-gold hover:text-black h-auto p-0 border-none"
											>
												Retry
											</Button>
										</div>
									</td>
								</tr>
							) : loadingOrders ? (
								[1, 2, 3].map((i) => (
									<tr key={i} className="animate-pulse">
										<td className="px-8 py-6" colSpan={7}>
											<div className="flex items-center gap-4">
												<div className="w-12 h-4 bg-gray-50 rounded" />
												<div className="flex-1 h-4 bg-gray-50 rounded" />
												<div className="w-24 h-4 bg-gray-50 rounded" />
											</div>
										</td>
									</tr>
								))
							) : latestOrders.length > 0 ? (
								latestOrders.map((order) => (
									<tr
										key={order.id}
										className="group hover:bg-gray-50/50 transition-colors"
									>
										<td className="px-8 py-5 text-xs font-black text-black">
											#{order.orderNumber || order.id.slice(0, 8)}
										</td>
										<td className="px-8 py-5 text-xs font-bold text-gray-500">
											{order.user
												? `${order.user.firstName} ${order.user.lastName}`
												: "Guest Customer"}
										</td>
										<td className="px-8 py-5 text-xs font-black text-black truncate max-w-50">
											{order.items && order.items.length > 0
												? order.items[0].productName
												: "Multiple Items"}
											{order.items && order.items.length > 1 && (
												<span className="ml-1.5 text-[9px] text-gray-400">
													+{order.items.length - 1} more
												</span>
											)}
										</td>
										<td className="px-8 py-5 text-xs font-black text-black">
											{formatCurrency(order.totalAmount)}
										</td>
										<td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
											{formatDate(order.createdAt)}
										</td>
										<td className="px-8 py-5">
											<span
												className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${getStatusColor(
													order.status,
												)}`}
											>
												{order.status}
											</span>
										</td>
										<td className="px-8 py-5 text-right">
											<Button
												asChild
												variant="ghost"
												size="sm"
												className="text-gray-300 hover:text-black px-4"
											>
												<Link href={`/orders/${order.id}`}>
													<MoreVertical size={16} />
												</Link>
											</Button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="px-8 py-20 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"
									>
										No orders found yet
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
