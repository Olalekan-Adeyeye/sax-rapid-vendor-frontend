"use client";
import {
	ShoppingBag,
	DollarSign,
	Eye,
	Bell,
	ArrowUpRight,
	AlertCircle,
	Package,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { getNotifications } from "@/lib/api/services/notifications";
import { getVendorOrders } from "@/lib/api/services/orders";
import {
	getVendorDashboardStats,
	getVendorPerformanceAnalytics,
	getVendorTopSellers,
} from "@/lib/api/services/analytics";
import { OrderStatus } from "@/lib/api/types/orders.types";
import { getRelativeTime, formatDate } from "@/lib/utils/date";
import { PageHeader } from "@/components/ui/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils/currency";

function PulsingDots() {
	return (
		<span className="flex items-center tracking-tighter">
			<span className="animate-[pulse_1.5s_ease-in-out_infinite]">.</span>
			<span className="animate-[pulse_1.5s_ease-in-out_0.2s_infinite]">.</span>
			<span className="animate-[pulse_1.5s_ease-in-out_0.4s_infinite]">.</span>
		</span>
	);
}

function StatCard({
	title,
	value,
	detail,
	icon: Icon,
	variant = "light",
	isError,
}: {
	title: string;
	value: React.ReactNode;
	detail: string;
	trend?: string;
	icon: React.ElementType;
	variant?: "light" | "dark";
	isError?: boolean;
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
					className={`text-2xl lg:text-3xl font-black tracking-tighter mb-2 transition-colors duration-300 flex items-center gap-2 ${
						!isDark && "group-hover:text-black"
					} ${isError ? "text-red-500" : ""}`}
				>
					{value}
					{isError && (
						<AlertCircle size={16} className="text-red-500 animate-pulse" />
					)}
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

function TopSellerCard({
	image,
	name,
	sales,
	revenue,
	productId,
}: {
	image: string;
	name: string;
	sales: string;
	revenue: string;
	productId: string;
}) {
	const isPlaceholder = !image || image === "";

	return (
		<div className="bg-white border border-gray-100 rounded overflow-hidden group hover:border-gold hover:shadow-lg transition-all flex flex-col">
			<div className="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
				{isPlaceholder ? (
					<div className="w-1/2 h-1/2 relative filter grayscale">
						<Image
							src="/assets/icons/SaxRapid-Logo.png"
							alt="Product placeholder"
							fill
							className="object-contain"
						/>
					</div>
				) : (
					<Image
						src={image}
						alt={name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-700 relative z-10"
					/>
				)}
				<div className="absolute top-3 right-3 z-20">
					<Link
						href={`/products/${productId}`}
						className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-black hover:bg-gold transition-colors shadow-sm block"
					>
						<ArrowUpRight size={14} />
					</Link>
				</div>
			</div>
			<div className="p-4 flex-1 flex flex-col">
				<p className="text-[10px] font-bold text-gray-400 mb-1">Top Seller</p>
				<Link
					href={`/products/${productId}`}
					className="block mb-3 hover:text-gold transition-colors"
				>
					<h4 className="text-sm font-bold text-black tracking-tight truncate">
						{name}
					</h4>
				</Link>

				<div className="space-y-4 mt-auto">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-black">
							<ShoppingBag size={14} className="text-gold" />
							<span className="text-xs font-bold">{sales} Units Sold</span>
						</div>
					</div>

					<div className="pt-3 border-t border-gray-50">
						<p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
							Revenue Generated
						</p>
						<p className="text-sm font-black text-black">{revenue}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function DashboardOverview() {
	const {
		data: orders,
		isLoading: loadingOrders,
		error: ordersError,
	} = useQuery({
		queryKey: ["vendor-orders", 1, 5],
		queryFn: () => getVendorOrders(1, 5),
	});

	const {
		data: notificationsData,
		isLoading: loadingNotifications,
		error: notificationsError,
	} = useQuery({
		queryKey: ["notifications", 1, 4],
		queryFn: () => getNotifications(1, 4),
	});

	const {
		data: dashboardStats,
		isLoading: loadingDashboardStats,
		error: dashboardStatsError,
	} = useQuery({
		queryKey: ["vendor-analytics-dashboard"],
		queryFn: () => getVendorDashboardStats(),
	});

	const {
		data: performanceData,
		isLoading: loadingPerformance,
		error: performanceError,
	} = useQuery({
		queryKey: ["vendor-analytics-performance"],
		queryFn: () =>
			getVendorPerformanceAnalytics({
				groupBy: "Month",
			}),
	});

	const {
		data: topSellers,
		isLoading: loadingTopSellers,
		error: topSellersError,
	} = useQuery({
		queryKey: ["vendor-analytics-top-sellers"],
		queryFn: () =>
			getVendorTopSellers({
				pageNumber: 1,
				pageSize: 3,
			}),
	});

	const notifications = notificationsData?.items || [];
	const latestOrders = orders || [];
	const topSellerItems = topSellers?.items || [];

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
					icon={DollarSign}
					title="Total Revenue"
					value={
						loadingDashboardStats ? (
							<PulsingDots />
						) : dashboardStatsError ? (
							"N/A"
						) : (
							formatCurrency(dashboardStats?.revenue || 0)
						)
					}
					isError={!!dashboardStatsError}
					detail={
						dashboardStats?.currency
							? `in ${dashboardStats.currency}`
							: "Available earnings"
					}
					variant="dark"
				/>
				<StatCard
					icon={ShoppingBag}
					title="Total Orders"
					value={
						loadingDashboardStats ? (
							<PulsingDots />
						) : dashboardStatsError ? (
							"N/A"
						) : (
							(dashboardStats?.totalOrders || 0).toLocaleString()
						)
					}
					isError={!!dashboardStatsError}
					detail="Completed transactions"
				/>
				<StatCard
					icon={Package}
					title="Active Products"
					value={
						loadingDashboardStats ? (
							<PulsingDots />
						) : dashboardStatsError ? (
							"N/A"
						) : (
							(dashboardStats?.activeProducts || 0).toLocaleString()
						)
					}
					isError={!!dashboardStatsError}
					detail={`of ${dashboardStats?.totalProducts || 0} total`}
				/>
				<StatCard
					icon={Users}
					title="Unique Customers"
					value={
						loadingDashboardStats ? (
							<PulsingDots />
						) : dashboardStatsError ? (
							"N/A"
						) : (
							(dashboardStats?.uniqueCustomers || 0).toLocaleString()
						)
					}
					isError={!!dashboardStatsError}
					detail="Total buyers"
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
								Top Selling Products
							</h4>
						</div>
						<Link
							href="/analytics"
							className="text-xs font-bold text-gray-400 hover:text-gold transition-colors"
						>
							View Analytics
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{loadingTopSellers ? (
							[1, 2, 3].map((i) => (
								<div
									key={i}
									className="bg-gray-100 rounded animate-pulse aspect-square"
								/>
							))
						) : topSellersError ? (
							<div className="col-span-full p-8 text-center bg-red-50/10 rounded flex flex-col items-center justify-center space-y-2">
								<AlertCircle size={20} className="text-red-500" />
								<p className="text-xs font-bold text-red-500">
									Failed to load top sellers
								</p>
							</div>
						) : topSellerItems.length > 0 ? (
							topSellerItems.map((product) => (
								<TopSellerCard
									key={product.productId}
									productId={product.productId}
									image={product.imageUrl || ""}
									name={product.productName || "Product"}
									sales={product.unitsSold.toLocaleString()}
									revenue={formatCurrency(product.revenueGenerated)}
								/>
							))
						) : (
							<div className="col-span-full p-8 text-center text-gray-400">
								<p className="text-xs font-bold">No sales data yet</p>
							</div>
						)}
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
							<div className="p-10 text-center flex-1 flex flex-col items-center justify-center space-y-4 bg-red-50/10">
								<div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-1">
									<AlertCircle size={20} className="text-red-500" />
								</div>
								<div className="space-y-1">
									<p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
										Failed to load updates
									</p>
									<p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
										Connection Sync Interrupted
									</p>
								</div>
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
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
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
						{loadingPerformance ? (
							<div className="w-full h-full bg-gray-50 rounded animate-pulse" />
						) : performanceError ? (
							<div className="w-full h-full flex items-center justify-center bg-red-50/10 rounded">
								<div className="text-center space-y-2">
									<AlertCircle size={20} className="text-red-500 mx-auto" />
									<p className="text-xs font-bold text-red-500">
										Failed to load performance data
									</p>
								</div>
							</div>
						) : performanceData && performanceData.length > 0 ? (
							<svg
								viewBox="0 0 1200 300"
								className="w-full h-full overflow-visible drop-shadow-[0_10px_10px_rgba(239,191,4,0.05)]"
								preserveAspectRatio="none"
							>
								<defs>
									<linearGradient
										id="chartGradient"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
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

								{(() => {
									const maxRevenue = Math.max(
										...performanceData.map((d) => d.revenue),
										1,
									);
									const points = performanceData.map((d, i) => ({
										x: (i / Math.max(performanceData.length - 1, 1)) * 1200,
										y: 300 - (d.revenue / maxRevenue) * 280,
										...d,
									}));

									const pathData =
										"M" + points.map((p) => `${p.x},${p.y}`).join(" L");
									const areaData = `M0,300 L${points.map((p) => `${p.x},${p.y}`).join(" L")} L1200,300 Z`;

									return (
										<>
											{/* Area Fill */}
											<path d={areaData} fill="url(#chartGradient)" />

											{/* The Line */}
											<path
												d={pathData}
												fill="none"
												stroke="#EFBF04"
												strokeWidth="4"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="animate-[LOADING-ANIMATION-OR-STRETCH]"
											/>

											{/* Active Marker Points (every 4th point or less if fewer) */}
											{points
												.filter(
													(_, i) =>
														i % Math.max(Math.floor(points.length / 4), 1) ===
														0,
												)
												.map((p, i) => (
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
										</>
									);
								})()}
							</svg>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
								<p className="text-xs font-bold text-gray-400">
									No performance data available
								</p>
							</div>
						)}

						{/* X-Axis Labels */}
						<div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-300">
							{performanceData && performanceData.length > 0 ? (
								performanceData
									.filter(
										(_, i) =>
											i %
												Math.max(Math.floor(performanceData.length / 7), 1) ===
											0,
									)
									.map((d, i) => {
										const date = new Date(d.date);
										return (
											<span key={i}>
												{date.toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
												})}
											</span>
										);
									})
							) : (
								<>
									{["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"].map(
										(m) => (
											<span key={m}>{m}</span>
										),
									)}
								</>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="bg-white border border-gray-100 rounded p-6">
						<div className="flex items-center justify-between mb-4">
							<h4 className="text-xs font-bold text-black">Inventory Health</h4>
						</div>

						{/* Inventory Content */}
						{loadingDashboardStats ? (
							<div className="h-28 rounded bg-gray-50 animate-pulse" />
						) : dashboardStatsError ? (
							<div className="h-28 flex items-center justify-center bg-red-50/10 rounded">
								<p className="text-xs font-bold text-red-500">
									Unable to load inventory data
								</p>
							</div>
						) : (
							(() => {
								const active = dashboardStats?.activeProducts || 0;
								const outOfStock = dashboardStats?.outOfStockProducts || 0;
								const total =
									(dashboardStats?.totalProducts ?? active + outOfStock) || 0;
								const pctActive =
									total > 0 ? Math.round((active / total) * 100) : 0;

								return (
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-[10px] font-bold text-gray-400">
													Products In Stock
												</p>
												<p className="text-lg font-black text-black">
													{active.toLocaleString()}
												</p>
											</div>
											<div>
												<p className="text-[10px] font-bold text-gray-400">
													Out of Stock
												</p>
												<p
													className={`text-lg font-black ${outOfStock > 0 ? "text-red-600" : "text-gray-600"}`}
												>
													{outOfStock.toLocaleString()}
												</p>
											</div>
											<div>
												<p className="text-[10px] font-bold text-gray-400">
													Total
												</p>
												<p className="text-lg font-black text-black">
													{total.toLocaleString()}
												</p>
											</div>
										</div>

										<div>
											<div className="h-2 bg-gray-50 rounded-full overflow-hidden">
												<div
													className="h-full bg-gold rounded-full transition-all"
													style={{ width: `${pctActive}%` }}
												/>
											</div>
											<p className="text-[10px] mt-1 text-gray-400">
												{pctActive}% in stock
											</p>
										</div>
									</div>
								);
							})()
						)}
					</div>

					<div className="bg-white border border-gray-100 rounded p-6">
						<div className="flex items-center justify-between mb-8">
							<h4 className="text-xs font-bold text-black">
								Product Revenue Share
							</h4>
						</div>
						<div className="space-y-6">
							{loadingTopSellers ? (
								[1, 2, 3, 4].map((i) => (
									<div key={i} className="space-y-2 animate-pulse">
										<div className="flex justify-between">
											<div className="h-2 bg-gray-50 rounded w-1/3" />
											<div className="h-2 bg-gray-50 rounded w-1/4" />
										</div>
										<div className="h-1.5 bg-gray-50 rounded-full" />
									</div>
								))
							) : topSellersError || topSellerItems.length === 0 ? (
								<div className="py-10 text-center">
									<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
										No data available
									</p>
								</div>
							) : (
								topSellerItems.slice(0, 4).map((product) => {
									const share = dashboardStats?.revenue
										? Math.round(
												(product.revenueGenerated / dashboardStats.revenue) *
													100,
											)
										: 0;
									return (
										<div key={product.productId} className="space-y-2">
											<div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
												<Link
													href={`/products/${product.productId}`}
													className="text-black truncate max-w-[70%] hover:text-gold transition-colors"
												>
													{product.productName}
												</Link>
												<span className="text-gray-400">{share}%</span>
											</div>
											<div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
												<div
													className="h-full bg-gold rounded-full transition-all duration-1000"
													style={{ width: `${share}%` }}
												/>
											</div>
										</div>
									);
								})
							)}
						</div>
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
									<td
										colSpan={7}
										className="px-8 py-20 text-center bg-red-50/5"
									>
										<div className="flex flex-col items-center justify-center space-y-4">
											<div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-1">
												<AlertCircle size={20} className="text-red-500" />
											</div>
											<div className="space-y-1">
												<p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
													Failed to load orders
												</p>
												<p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
													Transactional Data Unavailable
												</p>
											</div>
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
												className="text-gray-300 hover:text-black px-3!"
											>
												<Link href={`/orders/${order.id}`}>
													<Eye size={16} />
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
