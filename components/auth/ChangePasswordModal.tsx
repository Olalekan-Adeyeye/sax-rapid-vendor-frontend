"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/lib/api/services/auth";
import { useToast } from "@/lib/context/ToastContext";
import { getErrorMessage } from "@/lib/utils/errors";
import {
	changePasswordSchema,
	ChangePasswordFormValues,
} from "@/lib/schemas/auth";
import { Lock, AlertCircle } from "lucide-react";

interface ChangePasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ChangePasswordModal({
	isOpen,
	onClose,
}: ChangePasswordModalProps) {
	const { toast } = useToast();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
	});

	const mutation = useMutation({
		mutationFn: changePassword,
		onSuccess: () => {
			toast("Success", "Password changed successfully.", "success");
			reset();
			onClose();
		},
		onError: (error) => {
			toast("Error", getErrorMessage(error), "error");
		},
	});

	const onSubmit = (data: ChangePasswordFormValues) => {
		mutation.mutate(data);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Security Update"
			subtitle="Update your account management credentials"
			icon={Lock}
			size="lg"
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-6">
					<div className="space-y-3">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							Verification
						</label>
						<Input
							id="oldPassword"
							type="password"
							{...register("oldPassword")}
							error={errors.oldPassword?.message}
							placeholder="Current Password"
						/>
					</div>

					<div className="space-y-3">
						<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
							New Credentials
						</label>
						<div className="grid grid-cols-1 gap-4">
							<Input
								id="newPassword"
								type="password"
								{...register("newPassword")}
								error={errors.newPassword?.message}
								placeholder="New Password"
							/>
							<Input
								id="confirmPassword"
								type="password"
								{...register("confirmPassword")}
								error={errors.confirmPassword?.message}
								placeholder="Confirm New Password"
							/>
						</div>
					</div>
				</div>

				<div className="bg-amber-50 rounded p-6 flex gap-4 border border-amber-100">
					<AlertCircle className="text-amber-500 shrink-0" size={20} />
					<div className="space-y-1">
						<h6 className="text-[10px] font-bold text-amber-900 uppercase">
							Security Note
						</h6>
						<p className="text-[10px] font-medium text-amber-700 leading-relaxed">
							Changing your password will terminate all other active sessions.
							Ensure your new password is at least 8 characters and includes
							symbols for maximum security.
						</p>
					</div>
				</div>

				<div className="flex gap-4">
					<Button
						type="button"
						variant="outline"
						className="flex-1"
						onClick={onClose}
						disabled={mutation.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						className="flex-1"
						loading={mutation.isPending}
					>
						Update Credentials
					</Button>
				</div>
			</form>
		</Modal>
	);
}
