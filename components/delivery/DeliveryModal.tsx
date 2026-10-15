"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Truck, X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import * as deliveryService from "@/lib/api/services/delivery";
import {
	DELIVERY_PROVIDER_OPTIONS,
	isTerminalDeliveryStatus,
} from "@/lib/api/types/delivery.types";
import type {
	DeliveryProvider,
	DeliveryStatus,
} from "@/lib/api/types/delivery.types";
import { useToast } from "@/lib/context/ToastContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateTime } from "@/lib/utils/date";
import { getErrorMessage } from "@/lib/utils/errors";

const UPDATABLE_DELIVERY_STATUSES: DeliveryStatus[] = [
	"Requested",
	"RiderAssigned",
	"PickedUp",
	"InTransit",
	"Delivered",
	"Failed",
];

interface DeliveryModalProps {
	isOpen: boolean;
	onClose: () => void;
	orderId: string;
	delivery: deliveryService.DeliveryStatusInfo | null;
	/** Called after any successful mutation so the parent can refetch. */
	onChanged: () => void;
}

export function DeliveryModal({
	isOpen,
	onClose,
	orderId,
	delivery,
	onChanged,
}: DeliveryModalProps) {
	const { toast } = useToast();
	const { currency: activeCurrency } = useCurrency();
	const queryClient = useQueryClient();
	const [confirmCancel, setConfirmCancel] = useState(false);

	const deliveryId = deliveryService.normalizeDeliveryId(delivery);
	const currentStatus = delivery?.status || "";
	const isTerminal = isTerminalDeliveryStatus(currentStatus);

	const finish = (message: string) => {
		toast("Success", message, "success");
		onChanged();
		queryClient.invalidateQueries({ queryKey: ["delivery-status", orderId] });
	};

	const requestMutation = useMutation({
		mutationFn: (provider: DeliveryProvider) =>
			deliveryService.requestDelivery(orderId, provider),
		onSuccess: (_data, provider) =>
			finish(`Delivery requested via ${provider}.`),
		onError: (error) => toast("Error", getErrorMessage(error), "error"),
	});

	const updateMutation = useMutation({
		mutationFn: (status: DeliveryStatus) =>
			deliveryService.updateDeliveryStatus(deliveryId as string, status),
		onSuccess: (_data, status) =>
			finish(`Delivery status updated to ${status}.`),
		onError: (error) => toast("Error", getErrorMessage(error), "error"),
	});

	const cancelMutation = useMutation({
		mutationFn: () => deliveryService.cancelDelivery(deliveryId as string),
		onSuccess: () => {
			setConfirmCancel(false);
			finish("Delivery request cancelled.");
		},
		onError: (error) => toast("Error", getErrorMessage(error), "error"),
	});

	const busy =
		requestMutation.isPending ||
		updateMutation.isPending ||
		cancelMutation.isPending;

	const availableStatuses = UPDATABLE_DELIVERY_STATUSES.filter(
		(status) => status !== currentStatus,
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Manage Delivery"
			subtitle={
				deliveryId
					? "Update, track or cancel this delivery"
					: "Request a delivery for this order"
			}
			icon={Truck}
			size="lg"
		>
			<div className="space-y-8">
				{/* Current delivery (read-only summary) */}
				{deliveryId ? (
					<div className="bg-gray-50/50 border border-gray-100 rounded p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
						<div className="space-y-1">
							<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
								Status
							</p>
							<p className="text-xs font-black text-black">
								{currentStatus || "Unknown"}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
								Provider
							</p>
							<p className="text-xs font-black text-black">
								{delivery?.providerDisplayName ||
									delivery?.provider ||
									delivery?.providerCode ||
									"Unknown"}
							</p>
						</div>
						{(delivery?.serviceName || delivery?.serviceType) && (
							<div className="space-y-1">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Service
								</p>
								<p className="text-xs font-black text-black">
									{delivery.serviceName || delivery.serviceType}
								</p>
							</div>
						)}
						{delivery?.riderName && (
							<div className="space-y-1">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Rider
								</p>
								<p className="text-xs font-black text-black">
									{delivery.riderName}
									{delivery.riderPhone && (
										<a
											href={`tel:${delivery.riderPhone}`}
											className="block text-[11px] font-bold text-gold hover:underline"
										>
											{delivery.riderPhone}
										</a>
									)}
								</p>
							</div>
						)}
						{typeof delivery?.estimatedCost === "number" && (
							<div className="space-y-1">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Est. Cost
								</p>
								<p className="text-xs font-black text-black">
									{formatCurrency(
										delivery.estimatedCost,
										delivery.currency || activeCurrency,
									)}
								</p>
							</div>
						)}
						{delivery?.estimatedDeliveryAt && (
							<div className="space-y-1">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Est. Delivery
								</p>
								<p className="text-xs font-black text-black">
									{formatDateTime(delivery.estimatedDeliveryAt)}
								</p>
							</div>
						)}
						{delivery?.trackingCode && (
							<div className="space-y-1">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Tracking Code
								</p>
								<p className="text-xs font-black text-black">
									{delivery.trackingCode}
								</p>
							</div>
						)}
						{(delivery?.isBooked || delivery?.isQueued) && (
							<div className="space-y-1">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Booking
								</p>
								<p className="flex gap-1.5">
									{delivery.isBooked && (
										<span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-green-50 text-green-600">
											Booked
										</span>
									)}
									{delivery.isQueued && (
										<span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-gold/10 text-gold">
											Queued
										</span>
									)}
								</p>
							</div>
						)}
					</div>
				) : (
					<p className="text-[11px] font-bold text-gray-400">
						No delivery has been requested for this order yet.
					</p>
				)}

				{/* Request: manual provider picker */}
				{!deliveryId && (
					<div className="space-y-4">
						<h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
							Select a Provider
						</h5>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							{DELIVERY_PROVIDER_OPTIONS.map((option) => (
								<button
									key={option.id}
									type="button"
									disabled={busy}
									onClick={() => requestMutation.mutate(option.id)}
									className="p-4 rounded border border-gray-100 bg-white hover:border-black hover:text-gold transition-all text-left disabled:opacity-50"
								>
									<span className="text-[11px] font-black uppercase text-black">
										{option.label}
									</span>
								</button>
							))}
						</div>
					</div>
				)}

				{/* Update status */}
				{deliveryId && !isTerminal && (
					<div className="space-y-4">
						<h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
							Update Status
						</h5>
						<div className="flex flex-wrap gap-2">
							{availableStatuses.map((status) => (
								<button
									key={status}
									type="button"
									disabled={busy}
									onClick={() => updateMutation.mutate(status)}
									className="px-4 py-2 rounded-full border border-gray-100 bg-white text-[10px] font-black uppercase tracking-widest text-black hover:border-black hover:text-gold transition-all disabled:opacity-50"
								>
									{status}
								</button>
							))}
						</div>
					</div>
				)}

				{deliveryId && isTerminal && (
					<p className="text-[11px] font-bold text-gray-400">
						This delivery is closed ({currentStatus}) — no further
						actions are available.
					</p>
				)}

				{/* Cancel delivery */}
				{deliveryId && !isTerminal && (
					<div className="border-t border-gray-50 pt-6">
						{confirmCancel ? (
							<div className="bg-red-50/30 border border-red-100 rounded p-5 space-y-4">
								<p className="text-[11px] font-bold text-red-600">
									Cancel this delivery request? This action cannot
									be undone.
								</p>
								<div className="flex gap-3">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setConfirmCancel(false)}
										disabled={busy}
										className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest"
									>
										Keep Delivery
									</Button>
									<Button
										variant="primary"
										size="sm"
										onClick={() => cancelMutation.mutate()}
										loading={busy}
										className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest bg-red-600! text-white! border-red-600!"
									>
										<X size={12} className="mr-1" />
										Yes, Cancel Delivery
									</Button>
								</div>
							</div>
						) : (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setConfirmCancel(true)}
								className="text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest"
							>
								<X size={14} className="mr-1" />
								Cancel Delivery
							</Button>
						)}
					</div>
				)}
			</div>
		</Modal>
	);
}
