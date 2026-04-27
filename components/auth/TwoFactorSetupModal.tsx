"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Copy, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/lib/context/ToastContext";
import { verifyTwoFactor } from "@/lib/api/services/auth";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils/errors";
import { OTPInput } from "@/components/ui/OTPInput";

interface TwoFactorSetupModalProps {
	isOpen: boolean;
	onClose: () => void;
	qrCodeUri: string;
	manualEntryKey?: string;
	onSuccess: () => void;
}

export function TwoFactorSetupModal({
	isOpen,
	onClose,
	qrCodeUri,
	manualEntryKey,
	onSuccess,
}: TwoFactorSetupModalProps) {
	const { toast } = useToast();
	const [copied, setCopied] = React.useState(false);
	const [step, setStep] = React.useState<"SCAN" | "VERIFY">("SCAN");
	const [code, setCode] = React.useState("");

	const copyToClipboard = () => {
		if (manualEntryKey) {
			navigator.clipboard.writeText(manualEntryKey);
			setCopied(true);
			toast("Success", "Secret key copied to clipboard", "success");
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const verifyMutation = useMutation({
		mutationFn: verifyTwoFactor,
		onSuccess: () => {
			toast(
				"Success",
				"Two-Factor Authentication enabled successfully.",
				"success",
			);
			onSuccess();
			onClose();
			setStep("SCAN")
		},
		onError: (error) => {
			toast("Error", getErrorMessage(error), "error");
		},
	});

	const handleVerify = () => {
		if (code.length !== 6) {
			toast("Error", "Please enter a valid 6-digit code", "error");
			return;
		}
		verifyMutation.mutate({ code });
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={step === "SCAN" ? "MFA Configuration" : "MFA Verification"}
			subtitle={step === "SCAN" ? "Scan the QR code to sync your authenticator app" : "Confirm setup with your 6-digit verification code"}
			icon={ShieldCheck}
			size="lg"
		>
			<div className="space-y-10 py-4">
				{step === "SCAN" ? (
					<>
						<div className="flex flex-col items-center gap-8">
							<div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
								{qrCodeUri && (
									<QRCodeSVG
										value={qrCodeUri}
										size={220}
										level="H"
										includeMargin={true}
										className="mx-auto"
									/>
								)}
							</div>

							<div className="max-w-xs space-y-3 text-center">
								<p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">
									Compatible with Google Authenticator, Authy, and other TOTP applications.
								</p>
							</div>
						</div>

						{manualEntryKey && (
							<div className="bg-gray-50 p-6 rounded border border-gray-100 space-y-4">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Manual Configuration Key
								</label>
								<div className="flex items-center justify-between gap-4 bg-white border border-gray-100 p-4 rounded">
									<code className="text-xs font-black text-gold select-all break-all tracking-tighter">
										{manualEntryKey}
									</code>
									<button
										onClick={copyToClipboard}
										className="text-gray-400 hover:text-black transition-colors shrink-0"
									>
										{copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
									</button>
								</div>
							</div>
						)}

						<div className="flex gap-4">
							<Button
								onClick={onClose}
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								onClick={() => setStep("VERIFY")}
								className="flex-1"
								variant="primary"
							>
								Next Step <ArrowRight size={16} className="ml-2" />
							</Button>
						</div>
					</>
				) : (
					<div className="space-y-10">
						<div className="space-y-6">
							<div className="flex justify-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
								<OTPInput
									value={code}
									onChange={setCode}
									disabled={verifyMutation.isPending}
								/>
							</div>
							
							<div className="bg-green-50 p-6 rounded border border-green-100 flex gap-4">
								<ShieldCheck className="text-green-500 shrink-0" size={20} />
								<div className="space-y-1 text-left">
									<h6 className="text-[10px] font-bold text-green-900 uppercase">Verification Note</h6>
									<p className="text-[10px] font-medium text-green-700 leading-relaxed">
										Enter the current 6-digit code from your authenticator app to permanently 
										activate MFA protection for this account.
									</p>
								</div>
							</div>
						</div>

						<div className="flex gap-4">
							<Button
								onClick={() => setStep("SCAN")}
								variant="outline"
								className="flex-1"
								disabled={verifyMutation.isPending}
							>
								Back
							</Button>
							<Button
								onClick={handleVerify}
								className="flex-1"
								variant="primary"
								loading={verifyMutation.isPending}
							>
								Activate MFA
							</Button>
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
}
