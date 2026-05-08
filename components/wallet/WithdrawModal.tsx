"use client";
import React, { useState } from "react";
import { ArrowUpRight, Building2, User, Landmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/context/ToastContext";
import * as walletService from "@/lib/api/services/wallet";
import { Modal } from "@/components/ui/Modal";

interface WithdrawModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	availableBalance: number;
	currency: string;
}

export function WithdrawModal({
	isOpen,
	onClose,
	onSuccess,
	availableBalance,
	currency,
}: WithdrawModalProps) {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		amount: "",
		bankCode: "",
		accountNumber: "",
		accountName: "",
	});


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const numAmount = parseFloat(formData.amount);

		if (isNaN(numAmount) || numAmount <= 0) {
			toast(
				"Invalid Amount",
				"Please enter a valid amount to withdraw",
				"error",
			);
			return;
		}

		if (numAmount > availableBalance) {
			toast(
				"Insufficient Funds",
				"The withdrawal amount exceeds your available balance",
				"error",
			);
			return;
		}

		try {
			setLoading(true);
			await walletService.withdraw({
				amount: numAmount,
				bankCode: formData.bankCode,
				accountNumber: formData.accountNumber,
				accountName: formData.accountName,
			});


			toast(
				"Payout Requested",
				`Expect your funds in the secondary account within 24-48 hours`,
				"success",
			);
			onSuccess();
			onClose();
		} catch (err) {
			console.error("Withdrawal error:", err);
			toast(
				"Withdrawal Failed",
				"Could not process your payout request",
				"error",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Request Payout"
			subtitle="Withdraw funds to your bank account"
			icon={ArrowUpRight}
			size="lg"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-3">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Amount to Withdraw
						</label>
						<div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">
								{currency === "NGN" ? "₦" : "$"}
							</span>
							<Input
								id="withdraw-amount"
								type="number"
								placeholder="0.00"
								className="pl-10"
								value={formData.amount}
								onChange={(e) =>
									setFormData({ ...formData, amount: e.target.value })
								}
								required
							/>
						</div>
						<p className="text-[9px] font-black uppercase text-gray-300">
							Available: {currency} {availableBalance.toLocaleString()}
						</p>
					</div>
					<div className="space-y-3">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Bank Code
						</label>
						<div className="relative">
							<Building2
								className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
								size={14}
							/>
							<Input
								id="bank-code"
								placeholder="e.g. 058"
								className="pl-10 text-[10px]"
								value={formData.bankCode}
								onChange={(e) =>
									setFormData({ ...formData, bankCode: e.target.value })
								}
								required
							/>
						</div>
					</div>

				</div>

				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-3">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Account Number
						</label>
						<div className="relative">
							<Landmark
								className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
								size={14}
							/>
							<Input
								id="account-number"
								placeholder="10 Digits"
								className="pl-10 text-[10px]"
								value={formData.accountNumber}
								onChange={(e) =>
									setFormData({ ...formData, accountNumber: e.target.value })
								}
								required
							/>
						</div>
					</div>
					<div className="space-y-3">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Account Name
						</label>
						<div className="relative">
							<User
								className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
								size={14}
							/>
							<Input
								id="account-name"
								placeholder="Full Name"
								className="pl-10 text-[10px]"
								value={formData.accountName}
								onChange={(e) =>
									setFormData({ ...formData, accountName: e.target.value })
								}
								required
							/>
						</div>
					</div>
				</div>

				<div className="bg-amber-50 rounded p-6 flex gap-4 border border-amber-100/50">
					<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shrink-0">
						<span className="text-xs font-black">!</span>
					</div>
					<p className="text-[10px] font-medium text-amber-700/80 leading-relaxed italic">
						Withdrawals are subject to 24h verification. Ensure your bank
						details precisely match your vendor registration documents to avoid
						delays.
					</p>
				</div>

				<div className="flex gap-4 pt-4">
					<Button
						type="button"
						variant="outline"
						className="flex-1"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						className="flex-1"
						loading={loading}
					>
						Payout
					</Button>
				</div>
			</form>
		</Modal>
	);
}
