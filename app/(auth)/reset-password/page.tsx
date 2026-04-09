"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	resetPasswordSchema,
	ResetPasswordFormValues,
} from "@/lib/schemas/auth";

export default function ResetPasswordPage() {
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = () => {
		setLoading(true);
		// Simulate update
		setTimeout(() => {
			setLoading(false);
			setSuccess(true);
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased overflow-hidden text-black">
			{/* ── LEFT PANEL ─────────────────────────── */}
			<div className="hidden lg:flex flex-col justify-between w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-100 h-100 bg-gold/20 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute top-1/2 -left-20 w-56 h-56 bg-gold/15 rounded-full blur-[80px]" />

				<Link
					href="/"
					className="group w-fit relative z-20 transition-opacity hover:opacity-80"
				>
					<Logo size="md" />
				</Link>

				<div className="relative z-10 mt-10">
					<div className="w-12 h-1.5 bg-gold rounded-full mb-10" />
					<h2 className="text-5xl font-black text-black leading-[1.1] tracking-tighter mb-6 underline decoration-gold/50">
						Secure <br />
						Reset.
					</h2>
					<p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
						Choose a strong password and get your business back online in
						seconds.
					</p>

					<div className="bg-white border border-gray-100 rounded p-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-10 h-10 rounded bg-black flex items-center justify-center text-gold">
								<ShieldCheck size={20} />
							</div>
							<p className="text-[10px] font-black uppercase tracking-widest text-black">
								Authentication
							</p>
						</div>
						<p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
							&quot;Choose a unique and complex combination to protect your
							account from unwanted access.&quot;
						</p>
					</div>
				</div>
			</div>

			{/* ── MAIN CONTENT ───────────────────────── */}
			<div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-12 bg-[radial-gradient(circle_at_bottom_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white transition-all duration-700">
				<div className="w-full max-w-sm">
					<div className="mb-10 lg:hidden text-left">
						<Link
							href="/"
							className="group w-fit transition-opacity hover:opacity-80"
						>
							<Logo size="md" className="items-start" />
						</Link>
					</div>

					{!success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
							<div className="mb-10">
								<h1 className="text-4xl font-black text-black tracking-tighter mb-2">
									Reset Password.
								</h1>
								<p className="text-gray-500 text-sm font-medium">
									Create a new password that is secure and easy to remember.
								</p>
							</div>

							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<Input
									id="password"
									label="New Password"
									type={showPass ? "text" : "password"}
									{...register("password")}
									error={errors.password?.message}
									placeholder="••••••••"
									leftSlot={<Lock size={16} className="text-gray-400" />}
									rightSlot={
										<button
											type="button"
											onClick={() => setShowPass(!showPass)}
											className="text-gray-600 hover:text-black transition-colors p-1"
										>
											{showPass ? <EyeOff size={16} /> : <Eye size={16} />}
										</button>
									}
								/>

								<Input
									id="confirmPassword"
									label="Confirm New Password"
									type={showPass ? "text" : "password"}
									{...register("confirmPassword")}
									error={errors.confirmPassword?.message}
									placeholder="••••••••"
									leftSlot={<Lock size={16} className="text-gray-400" />}
								/>

								<Button
									type="submit"
									loading={loading}
									fullWidth
									className="py-5"
								>
									Update Password
								</Button>
							</form>
						</div>
					) : (
						<div className="text-center animate-in zoom-in-95 fade-in duration-500">
							<div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/40">
								<CheckCircle2 size={32} className="text-gold" />
							</div>
							<h2 className="text-3xl font-black text-black tracking-tighter mb-4">
								Access Restored.
							</h2>
							<p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
								Your password has been successfully updated. You can now use
								your new credentials to log in.
							</p>
							<Button asChild fullWidth variant="black">
								<Link href="/login">Log In to Your Store</Link>
							</Button>
						</div>
					)}
				</div>

				<p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden text-center">
					© 2026 SAX-RAPID · Official Merchant Hub
				</p>
			</div>
		</div>
	);
}
