"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/lib/context/ToastContext";
import { disableTwoFactor } from "@/lib/api/services/auth";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils/errors";

interface Disable2faModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function Disable2faModal({
	isOpen,
	onClose,
	onSuccess,
}: Disable2faModalProps) {
	const { toast } = useToast();
	const [password, setPassword] = React.useState("");

	const disableMutation = useMutation({
		mutationFn: disableTwoFactor,
		onSuccess: () => {
			toast("Success", "Two-Factor Authentication disabled.", "success");
			onSuccess();
			onClose();
			setPassword("");
		},
		onError: (error) => {
			toast("Error", getErrorMessage(error), "error");
		},
	});

	const handleDisable = () => {
		if (!password) {
			toast("Error", "Please enter your password to continue", "error");
			return;
		}
		disableMutation.mutate({ password });
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Disable MFA"
			subtitle="Remove the multi-factor authentication security layer"
			icon={ShieldOff}
			size="lg"
		>
			<div className="space-y-8 py-4">
				<div className="bg-red-50 p-6 rounded border border-red-100 flex gap-4">
					<div className="w-12 h-12 rounded bg-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-200">
						<AlertTriangle size={24} />
					</div>
					<div className="space-y-1">
						<h6 className="text-[10px] font-bold text-red-900 uppercase">Critical Warning</h6>
						<p className="text-[10px] font-medium text-red-600/80 leading-relaxed">
							Disabling MFA significantly increases the risk of unauthorized access to your 
							account. We strongly advise against this action unless absolutely necessary.
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="space-y-3">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Confirm Management Password
						</label>
						<Input
							id="confirm-password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex gap-4">
					<Button
						onClick={onClose}
						variant="outline"
						className="flex-1 h-12"
						disabled={disableMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleDisable}
						variant="black"
						className="flex-1 h-12"
						loading={disableMutation.isPending}
					>
						<ShieldOff size={18} className="mr-2" />
						Disable MFA
					</Button>
				</div>
			</div>
		</Modal>
	);
}
