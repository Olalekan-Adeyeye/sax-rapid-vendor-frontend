"use client";
import { useState } from "react";
import {
	ShoppingBag,
	Filter,
	MoreVertical,
	Eye,
	Truck,
	Loader2,
	Printer,
	Mail,
	XCircle,
	AlertCircle,
} from "lucide-react";
import {
	Dropdown,
	DropdownItem,
	DropdownDivider,
} from "@/components/ui/Dropdown";
import { useQuery } from "@tanstack/react-query";
import * as ordersService from "@/lib/api/services/orders";
import { OrderStatus } from "@/lib/api/types/orders.types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { useToast } from "@/lib/context/ToastContext";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OrdersPage() {
	const [activeTab, setActiveTab] = useState("All Orders");
	const [searchQuery, setSearchQuery] = useState("");
	const { toast } = useToast();

	const {
		data: ordersData,
		isLoading: loading,
		error: ordersError,
		refetch,
	} = useQuery({
		queryKey: ["vendor-orders", 1, 100],
		queryFn: () => ordersService.getVendorOrders(1, 100),
	});

	const orders = ordersData || [];

	const filteredOrders = orders.filter((order) => {
		// Tab Filter
		if (activeTab !== "All Orders") {
			const statusMap: Record<string, string> = {
				New: OrderStatus.Pending,
				Processing: OrderStatus.Processing,
				Completed: OrderStatus.Delivered,
				Cancelled: OrderStatus.Cancelled,
				Returns: OrderStatus.Refunded,
			};
			if (order.status !== statusMap[activeTab]) return false;
		}

		// Search Filter
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			return (
				order.orderNumber?.toLowerCase().includes(q) ||
				order.id.toLowerCase().includes(q)
			);
		}

		return true;
	});

	const getStatusStyle = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.Pending:
				return "bg-gold/10 text-gold";
			case OrderStatus.Confirmed:
			case OrderStatus.Processing:
				return "bg-blue-50 text-blue-600";
			case OrderStatus.Shipped:
				return "bg-purple-50 text-purple-600";
			case OrderStatus.Delivered:
				return "bg-green-50 text-green-600";
			case OrderStatus.Cancelled:
			case OrderStatus.Failed:
				return "bg-red-50 text-red-600";
			case OrderStatus.OnHold:
				return "bg-amber-50 text-amber-600";
			case OrderStatus.Dispute:
				return "bg-orange-50 text-orange-600";
			default:
				return "bg-gray-50 text-gray-400";
		}
	};

	return (
		<div className="space-y-10">
			{loading && orders.length === 0 ? (
				<FullPageLoader label="Loading orders..." icon={ShoppingBag} />
			) : ordersError && orders.length === 0 ? (
				<ErrorComponent
					title="Failed to load Orders"
					message={getErrorMessage(ordersError)}
					onRetry={() => refetch()}
				/>
			) : (
				<>
					<PageHeader
						title="Customer Orders"
						description="Manage and track all customer purchases"
						actions={
							<Button
								onClick={() =>
									toast(
										"Information",
										"Export functionality is coming soon",
										"info",
									)
								}
								rounded="full"
								variant="outline"
								size="sm"
								className="px-8 py-3.5"
							>
								<ShoppingBag size={16} />
								Export Orders
							</Button>
						}
					/>

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
								className={`text-xs font-bold pb-3 px-1 transition-all relative shrink-0 ${
									activeTab === tab
										? "text-gold"
										: "text-gray-400 hover:text-black"
								}`}
							>
								{tab}
								{activeTab === tab && (
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
								)}
							</button>
						))}
					</div>

					<div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
						<div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div className="relative flex-1 max-w-md">
								<SearchInput
									placeholder="Search by order ID..."
									value={searchQuery}
									onChange={setSearchQuery}
									variant="muted"
									fullWidth
									focusColor="gold"
								/>
							</div>
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									size="sm"
									className="text-gray-400! hover:text-black! flex items-center gap-2"
								>
									<Filter size={14} />
									Filter
								</Button>
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
									{loading ? (
										<tr>
											<td colSpan={7} className="px-8 py-20 text-center">
												<Loader2
													className="animate-spin text-gold mx-auto"
													size={40}
												/>
												<p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
													Loading orders...
												</p>
											</td>
										</tr>
									) : filteredOrders.length > 0 ? (
										filteredOrders.map((order) => (
											<tr
												key={order.id}
												className="hover:bg-gray-50/50 transition-colors group"
											>
												<td className="px-8 py-5 text-[11px] font-black text-black">
													#{order.orderNumber || order.id.slice(0, 8)}
												</td>
												<td className="px-8 py-5">
													<div className="flex flex-col">
														<span className="text-xs font-black text-black uppercase tracking-tighter">
															{order.user
																? `${order.user.firstName || ""} ${order.user.lastName || ""}`
																: "Customer"}
														</span>
														<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
															{order.user?.email ||
																`ID: ${order.id.slice(0, 6)}...`}
														</span>
													</div>
												</td>
												<td className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase">
													{order.items?.length || 0}{" "}
													{order.items?.length === 1 ? "Item" : "Items"}
												</td>
												<td className="px-8 py-5 text-sm font-black text-black">
													{formatCurrency(order.totalAmount)}
												</td>
												<td className="px-8 py-5">
													<span
														className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${getStatusStyle(order.status)}`}
													>
														{order.status}
													</span>
												</td>
												<td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
													{formatDate(order.createdAt)}
												</td>
												<td className="px-8 py-5 text-right">
													<div className="flex items-center justify-end gap-2">
														<Button
															variant="outline"
															asChild
															className="w-9 h-9 p-0! text-gray-400!"
														>
															<Link href={`/orders/${order.id}`}>
																<Eye size={14} />
															</Link>
														</Button>
														<Button
															variant="outline"
															className="w-9 h-9 p-0! text-gray-400!"
														>
															<Truck size={14} />
														</Button>
														<Dropdown
															trigger={
																<Button
																	variant="outline"
															className="w-9 h-9 p-0! text-gray-400!"
																>
																	<MoreVertical size={14} />
																</Button>
															}
														>
															<DropdownItem
																icon={<Printer size={14} />}
																onClick={() =>
																	toast(
																		"Invoice",
																		"Generating PDF invoice...",
																		"info",
																	)
																}
															>
																Print Invoice
															</DropdownItem>
															<DropdownItem
																icon={<Mail size={14} />}
																onClick={() =>
																	toast(
																		"Message",
																		"Opening customer chat...",
																		"info",
																	)
																}
															>
																Contact Customer
															</DropdownItem>
															<DropdownDivider />
															{order.status !== OrderStatus.Cancelled &&
																order.status !== OrderStatus.Delivered && (
																	<DropdownItem
																		icon={<XCircle size={14} />}
																		variant="danger"
																		onClick={() =>
																			toast(
																				"Order Status",
																				"Requesting order cancellation...",
																				"info",
																			)
																		}
																	>
																		Cancel Order
																	</DropdownItem>
																)}
															<DropdownItem icon={<AlertCircle size={14} />}>
																Flag Order
															</DropdownItem>
														</Dropdown>
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={7} className="px-8 py-20 text-center">
												<div className="w-16 h-16 rounded bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 mx-auto mb-4">
													<ShoppingBag size={32} />
												</div>
												<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
													No orders found
												</p>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
