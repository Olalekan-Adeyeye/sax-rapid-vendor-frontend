"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/common/Logo";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ApiError } from "@/lib/api/types/auth.types";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { verifyOtp, resendOtp } from "@/lib/api/services/auth";
import { tokenStorage } from "@/lib/api/apiClient";

export default function VerifyPage() {
	const router = useRouter();
	const { user, refreshProfile } = useAuth();
	const { toast } = useToast();
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);
	const [timer, setTimer] = useState(45);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((t) => (t > 0 ? t - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (otp.length < 6) return;

		setLoading(true);
		try {
			const response = await verifyOtp({
				email: user?.email || "",
				otpCode: otp,
			});

			// 1. Manually manage tokens
			if (response.token && response.refreshToken) {
				tokenStorage.setTokens(response.token, response.refreshToken);
			}

			// 2. Refresh profile state
			await refreshProfile();

			toast("Success", "Email verified successfully!", "success");

			// Let AuthGuard handle the final destination
			router.replace("/dashboard");
		} catch (err: unknown) {
			let message = "Invalid or expired OTP";
			if (axios.isAxiosError<ApiError>(err)) {
				message = err.response?.data?.message || message;
			}
			toast("Verification Failed", message, "error");
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (!user?.email) return;
		setResending(true);
		try {
			await resendOtp({ email: user.email });
			toast("OTP Resent", "A new code has been sent to your email.", "success");
			setTimer(45);
		} catch {
			toast("Error", "Failed to resend OTP. Please try again.", "error");
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased overflow-hidden text-black">
			{/* ── LEFT PANEL ─────────────────────────── */}
			<div className="hidden lg:flex flex-col justify-between w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-100 h-100 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-pink/20 rounded-full -mr-32 -mt-32" />
				<div className="absolute bottom-0 left-0 w-100 h-100 bg-vibrant-blue/15 rounded-full -ml-40 -mb-40" />
				<div className="absolute top-1/2 -left-20 w-56 h-56 bg-vibrant-purple/20 rounded-full" />
				<div className="absolute top-1/4 -right-10 w-40 h-40 bg-gold/25 rounded-full" />

				<Link
					href="/"
					className="group w-fit relative z-20 transition-opacity hover:opacity-80"
				>
					<Logo size="md" />
				</Link>

				<div className="relative z-10 mt-10">
					<div className="w-12 h-1.5 bg-gold rounded-full mb-10" />
					<h2 className="text-5xl font-black text-black leading-[1.1] tracking-tighter mb-6 underline decoration-gold/30">
						Security <br />
						Check.
					</h2>
					<p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
						We take security seriously. Please verify your email address to gain
						access to the vendor empire.
					</p>
				</div>

				<p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 relative z-10">
					© 2026 SAX-RAPID
				</p>
			</div>

			{/* ── MAIN CONTENT ───────────────────────── */}
			<div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/5 via-white to-white">
				<div className="w-full max-w-sm">
					<div className="mb-10 lg:hidden text-left">
						<Link
							href="/"
							className="group w-fit transition-opacity hover:opacity-80"
						>
							<Logo size="sm" className="items-start" />
						</Link>
					</div>

					<div className="mb-10">
						<h1 className="text-4xl font-black text-black tracking-tighter mb-2">
							Verify Code.
						</h1>
						<p className="text-gray-500 text-sm font-medium">
							Enter the 6-digit verification code sent to your registered email
							address.
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-12 animate-in fade-in slide-in-from-bottom-2 delay-200"
					>
						<div className="flex flex-col items-center gap-6">
							<input
								type="text"
								maxLength={6}
								autoFocus
								placeholder="0 0 0 0 0 0"
								className="bg-transparent border-b-2 border-gray-100 text-center text-3xl font-black tracking-[0.2em] text-black outline-none focus:border-gold transition-all w-full max-w-xs py-3 placeholder:text-gray-100"
								value={otp}
								onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
							/>
							<div className="flex flex-col gap-2">
								{timer > 0 ? (
									<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
										Resend code in{" "}
										<span className="text-gold">
											0:{timer < 10 ? `0${timer}` : timer}
										</span>
									</p>
								) : (
									<button
										type="button"
										onClick={handleResend}
										disabled={resending}
										className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold hover:text-black transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{resending && (
											<svg
												className="animate-spin h-3 w-3"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
										)}
										{resending ? "Resending..." : "Resend Code Now"}
									</button>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-6">
							<Button
								fullWidth
								size="lg"
								loading={loading}
								type="submit"
								disabled={otp.length < 6}
								className="py-5"
							>
								Authorize Access
							</Button>
							<div className="flex items-center justify-center gap-2">
								<span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
									Incorrect Email?
								</span>
								<Link
									href="/signup"
									className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-black transition-colors underline underline-offset-4"
								>
									Back to Signup
								</Link>
							</div>
						</div>
					</form>
				</div>

				<p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden text-center">
					© 2026 SAX-RAPID · Official Merchant Verification
				</p>
			</div>
		</div>
	);
}
