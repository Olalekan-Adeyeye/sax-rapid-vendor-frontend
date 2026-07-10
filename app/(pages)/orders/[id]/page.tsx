"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	Package,
	Truck,
	CheckCircle2,
	Clock,
	MapPin,
	CreditCard,
	User,
	ExternalLink,
	X,
	AlertTriangle,
	ChevronDown,
} from "lucide-react";
import * as ordersService from "@/lib/api/services/orders";
import * as deliveryService from "@/lib/api/services/delivery";
import { OrderStatus } from "@/lib/api/types/orders.types";
import { DeliveryProvider } from "@/lib/api/types/delivery.types";
import { downloadInvoicePdf } from "@/lib/utils/invoice";
import { formatCurrency } from "../../../../lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { formatVariationDetails } from "@/lib/utils/product";
import { useToast } from "@/lib/context/ToastContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";

function getStatusIcon(status: OrderStatus) {
	switch (status) {
		case OrderStatus.Confirmed: return <CheckCircle2 size={14} />;
		case OrderStatus.Processing: return <Package size={14} />;
		case OrderStatus.Shipped: return <Truck size={14} />;
		case OrderStatus.Delivered: return <CheckCircle2 size={14} />;
		case OrderStatus.Completed: return <CheckCircle2 size={14} />;
		case OrderStatus.Cancelled: return <X size={14} />;
		case OrderStatus.OnHold: return <Clock size={14} />;
		case OrderStatus.Refunded: return <CreditCard size={14} />;
		case OrderStatus.Disputed: return <AlertTriangle size={14} />;
		case OrderStatus.Dispute: return <AlertTriangle size={14} />;
		default: return null;
	}
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	[OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Cancelled],
	[OrderStatus.Confirmed]: [OrderStatus.Processing, OrderStatus.Cancelled],
	[OrderStatus.Processing]: [OrderStatus.Shipped, OrderStatus.OnHold, OrderStatus.Cancelled],
	[OrderStatus.Shipped]: [OrderStatus.Delivered, OrderStatus.OnHold],
	[OrderStatus.Delivered]: [OrderStatus.Completed, OrderStatus.Disputed],
	[OrderStatus.Completed]: [],
	[OrderStatus.Cancelled]: [],
	[OrderStatus.Disputed]: [OrderStatus.OnHold, OrderStatus.Refunded],
	[OrderStatus.Refunded]: [],
	[OrderStatus.Failed]: [OrderStatus.Pending, OrderStatus.Cancelled],
	[OrderStatus.OnHold]: [OrderStatus.Processing, OrderStatus.Cancelled],
	[OrderStatus.Dispute]: [OrderStatus.OnHold, OrderStatus.Refunded],
};

export default function OrderDetailsPage() {
	const params = useParams();
	const orderId = params.id as string;
	const router = useRouter();
	const { toast } = useToast();
	const { currency: activeCurrency } = useCurrency();

	const [updating, setUpdating] = useState(false);
	const queryClient = useQueryClient();

	const {
		data: order,
		isLoading: loading,
		error: fetchError,
	} = useQuery({
		queryKey: ["order", orderId],
		queryFn: () => ordersService.getOrderById(orderId),
		enabled: !!orderId,
	});

	const handleUpdateStatus = async (newStatus: OrderStatus) => {
		try {
			setUpdating(true);
			const updated = await ordersService.updateOrderStatus(orderId, {
				status: newStatus,
			});
			queryClient.setQueryData(["order", orderId], updated);
			toast("Success", `Order status updated to ${newStatus}`, "success");
		} catch {
			toast("Error", "Failed to update order status", "error");
		} finally {
			setUpdating(false);
		}
	};

	const handleRequestDelivery = async (provider: DeliveryProvider) => {
		try {
			setUpdating(true);
			await deliveryService.requestDelivery(orderId, provider);
			toast("Delivery Requested", `Delivery has been requested via ${provider}`, "success");
		} catch {
			toast("Error", "Failed to request delivery", "error");
		} finally {
			setUpdating(false);
		}
	};

	if (loading) {
		return <FullPageLoader label="Loading order details..." icon={Package} />;
	}

	if (fetchError || !order) {
		return (
			<ErrorComponent
				title={fetchError ? "Failed to load Order" : "Order Not Found"}
				message={
					fetchError
						? getErrorMessage(fetchError)
						: "The order you are looking for does not exist or has been removed."
				}
				onRetry={() => {}}
			/>
		);
	}

	const steps = [
		{ status: OrderStatus.Pending, icon: Clock, label: "Order Placed" },
		{ status: OrderStatus.Confirmed, icon: CheckCircle2, label: "Confirmed" },
		{ status: OrderStatus.Processing, icon: Package, label: "Processing" },
		{ status: OrderStatus.Shipped, icon: Truck, label: "Shipped" },
		{ status: OrderStatus.Delivered, icon: CheckCircle2, label: "Delivered" },
	];

	const currentStepIndex = steps.findIndex((s) => s.status === order.status);

	return (
		<div className="space-y-10 pb-20">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div className="space-y-4">
					<button
						onClick={() => router.push("/orders")}
						className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors"
					>
						<ArrowLeft size={16} />
						<span className="text-xs font-bold">Back to Orders</span>
					</button>
					<div className="flex flex-wrap items-center gap-4">
						<h2 className="text-3xl font-black tracking-tighter text-black">
							Order #{order.orderNumber || order.id.slice(0, 8)}
						</h2>
						<span className="bg-black text-gold px-4 py-1.5 rounded text-xs font-bold">
							{order.status}
						</span>
					</div>
					<p className="text-gray-500 text-sm font-medium">
						Placed on {formatDate(order.createdAt)}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Button
					variant="outline"
					size="sm"
					onClick={() => { downloadInvoicePdf(order, activeCurrency); }}
					className="rounded-full px-6 text-xs font-bold"
				>
					Download Invoice
				</Button>
				</div>
			</div>

			{(() => {
				const available = VALID_TRANSITIONS[order.status];
				if (available.length === 0 && order.status !== OrderStatus.Shipped) return null;
				return (
					<div className="flex flex-wrap items-center justify-end gap-3">
						{available.length > 0 && (
							<Dropdown
								trigger={
									<Button variant="primary" size="sm" className="rounded-full px-5 text-xs font-bold">
										Update Status <ChevronDown size={14} />
									</Button>
								}
							>
								<div className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
									Update Status
								</div>
								<DropdownDivider />
								{available.map((s) => (
									<DropdownItem
										key={s}
										onClick={() => handleUpdateStatus(s)}
										disabled={updating}
										icon={getStatusIcon(s)}
										variant={
											[OrderStatus.Cancelled].includes(s)
												? "danger"
												: [OrderStatus.OnHold, OrderStatus.Dispute, OrderStatus.Disputed].includes(s)
													? "warning"
													: "default"
										}
									>
										{s}
									</DropdownItem>
								))}
							</Dropdown>
						)}
						{order.status === OrderStatus.Shipped && (
							<Dropdown
								trigger={
									<Button variant="black" size="sm" className="rounded-full px-5 text-xs font-bold">
										Request Delivery <ChevronDown size={14} />
									</Button>
								}
							>
								<div className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
									Select Provider
								</div>
								<DropdownDivider />
								<DropdownItem onClick={() => handleRequestDelivery("Manual")} icon={<Truck size={14} />}>
									Manual
								</DropdownItem>
								<DropdownItem onClick={() => handleRequestDelivery("Uber")} icon={<Truck size={14} />}>
									Uber
								</DropdownItem>
								<DropdownItem onClick={() => handleRequestDelivery("Bolt")} icon={<Truck size={14} />}>
									Bolt
								</DropdownItem>
							</Dropdown>
						)}
					</div>
				);
			})()}

			{/* Progress Tracker */}
			<div className="bg-white border border-gray-100 rounded p-8 sm:p-10 overflow-hidden">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-8 relative">
					{/* Mobile Vertical Line */}
					<div className="absolute top-0 bottom-0 left-5.75 w-0.5 bg-gray-50 md:hidden" />

					{/* Desktop Horizontal Line */}
					<div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-50 hidden md:block" />

					{steps.map((step, index) => {
						const isCompleted = index <= currentStepIndex;
						const isCurrent = index === currentStepIndex;
						const StepIcon = step.icon;

						return (
							<div
								key={step.status}
								className="relative z-10 flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-4 group w-full md:w-auto"
							>
								<div
									className={`w-12 h-12 rounded flex items-center justify-center border-4 transition-all duration-500 shrink-0 ${
										isCompleted
											? "bg-black border-gold text-gold"
											: "bg-white border-gray-50 text-gray-300"
									}`}
								>
									<StepIcon size={20} />
								</div>
								<div className="text-left md:text-center space-y-1">
									<p
										className={`text-xs font-bold uppercase tracking-widest ${
											isCompleted ? "text-black" : "text-gray-300"
										}`}
									>
										{step.label}
									</p>
									{isCurrent && (
										<div className="flex items-center gap-2">
											<div className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
											<span className="text-[12px] font-bold text-gold uppercase tracking-tighter">
												Current Stage
											</span>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				{/* Main Content: Order Items */}
				<div className="lg:col-span-2 space-y-10">
					<div className="bg-white border border-gray-100 rounded overflow-hidden">
						<div className="p-6 border-b border-gray-100">
							<h4 className="text-sm font-bold text-black">
								Order Items ({order.items?.length || 0})
							</h4>
						</div>
						<div className="divide-y divide-gray-50">
							{order.items?.map((item) => (
								<div
									key={item.id}
									className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 group"
								>
									<div className="w-20 h-20 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-300 shrink-0">
										<Package size={32} />
									</div>
									<div className="flex-1 space-y-1">
										<div className="flex items-start justify-between">
											<h5 className="text-sm font-black text-black uppercase tracking-tight group-hover:text-gold transition-colors">
												{item.productName || "Product Name"}
											</h5>
											<p className="text-sm font-black text-black">
												{formatCurrency(item.totalPrice, activeCurrency)}
											</p>
										</div>
										{item.variationDetails && (
											<p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
												{formatVariationDetails(item.variationDetails)}
											</p>
										)}
										<div className="flex items-center gap-4 mt-2">
											<span className="text-[12px] font-bold text-gray-400">
												SKU:{" "}
												<span className="text-black">
													{item.productSKU || "N/A"}
												</span>
											</span>
											<span className="text-[12px] font-bold text-gray-400">
												Qty: <span className="text-black">{item.quantity}</span>
											</span>
											<span className="text-[12px] font-bold text-gray-400">
												Price:{" "}
												<span className="text-black">
													{formatCurrency(item.unitPrice, activeCurrency)}
												</span>
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="bg-white border border-gray-100 border-t-0 p-8 space-y-4 rounded-b">
							<div className="flex justify-between text-[12px] font-black text-gray-400 uppercase tracking-widest">
								<span>Subtotal Cost</span>
								<span className="text-black">
									{formatCurrency(order.subTotal, activeCurrency)}
								</span>
							</div>
							<div className="flex justify-between text-[12px] font-black text-gray-400 uppercase tracking-widest">
								<span>Logistics</span>
								<span className="text-black">
									{formatCurrency(order.shippingFee, activeCurrency)}
								</span>
							</div>
							<div className="flex justify-between text-[12px] font-black text-gray-400 uppercase tracking-widest">
								<span>Tax</span>
								<span className="text-black">
									{formatCurrency(order.taxAmount, activeCurrency)}
								</span>
							</div>
							{order.discountAmount > 0 && (
								<div className="flex justify-between text-[12px] font-black text-red-500 uppercase tracking-widest">
									<span>Discount</span>
									<span>-{formatCurrency(order.discountAmount, activeCurrency)}</span>
								</div>
							)}
						</div>

						{/* Flat Total Section */}
						<div className="bg-black text-white p-8 flex items-center justify-between border border-black rounded">
							<div className="space-y-1">
								<p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.2em]">
									Total Amount
								</p>
							</div>
							<div className="text-right">
								<span className="text-4xl font-black text-white tracking-tighter">
									{formatCurrency(order.totalAmount, activeCurrency)}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar: Customer & Shipping */}
				<div className="space-y-10">
					{/* Customer Info */}
					<div className="bg-white border border-gray-100 rounded overflow-hidden">
						<div className="p-6 border-b border-gray-100 bg-black">
							<h4 className="text-sm font-bold text-white flex items-center gap-3">
								<User size={14} className="text-gold" />
								Customer Details
							</h4>
						</div>
						<div className="p-6 space-y-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-black uppercase">
									{order.user
										? `${order.user.firstName?.[0] || ""}${order.user.lastName?.[0] || ""}`
										: "U"}
								</div>
								<div>
									<h5 className="text-sm font-bold text-black capitalize">
										{order.user
											? `${order.user.firstName || ""} ${order.user.lastName || ""}`
											: "Unnamed User"}
									</h5>
									<p className="text-xs font-bold text-gray-400 truncate max-w-37.5">
										{order.user?.email || "No email provided"}
									</p>
								</div>
							</div>
							<div className="space-y-4 pt-2">
								<div className="flex items-center justify-between text-[12px] font-bold">
									<span className="text-gray-400 uppercase tracking-widest">
										Phone
									</span>
									{order.user?.phoneNumber ? (
										<a
											href={`tel:${order.user.phoneNumber}`}
											className="text-black hover:text-gold transition-colors"
										>
											{order.user.phoneNumber}
										</a>
									) : (
										<span className="text-black">N/A</span>
									)}
								</div>
							</div>
							{/* <button 
                onClick={() => router.push(`/messages?orderId=${order.id}`)}
                className="w-full py-3.5 rounded bg-gold/10 text-gold border border-gold/20 text-xs font-bold hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageSquare size={14} />
                Message Customer
              </button> */}
						</div>
					</div>

					{/* Shipping Info */}
					<div className="bg-white border border-gray-100 rounded p-6 space-y-6">
						<div className="flex items-center gap-3 text-gold">
							<MapPin size={16} />
							<h4 className="text-sm font-bold text-black">Delivery Address</h4>
						</div>
						<div className="space-y-4">
							<p className="text-xs font-bold text-gray-600 leading-relaxed uppercase">
								{order.shippingAddress || "No address provided"}
							</p>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<span className="text-[12px] font-bold text-gray-400">
										City
									</span>
									<p className="text-xs font-bold text-black">
										{order.shippingCity || "N/A"}
									</p>
								</div>
								<div className="space-y-1">
									<span className="text-[12px] font-bold text-gray-400">
										State
									</span>
									<p className="text-xs font-bold text-black">
										{order.shippingState || "N/A"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Info */}
					<div className="bg-white border border-gray-100 rounded p-6 space-y-6">
						<div className="flex items-center gap-3 text-gold">
							<CreditCard size={16} />
							<h4 className="text-sm font-bold text-black">Payment Meta</h4>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-bold text-gray-400">
									Method
								</span>
								<span className="text-[12px] font-bold text-black">
									{order.paymentMethod}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-bold text-gray-400">
									Status
								</span>
								<span className="text-[12px] font-bold text-green-500">
									{order.paymentStatus}
								</span>
							</div>
							{order.trackingNumber && (
								<div className="pt-4 border-t border-gray-50 space-y-2">
									<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
										Tracking ID
									</span>
									<div className="flex items-center justify-between">
										<span className="text-[11px] font-black text-black tracking-tight">
											{order.trackingNumber}
										</span>
										<ExternalLink size={12} className="text-gold" />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
