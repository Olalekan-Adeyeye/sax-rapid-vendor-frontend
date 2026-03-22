"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

export default function VerifyPage() {
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [timer, setTimer] = useState(45);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((t) => (t > 0 ? t - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Simulate verification
		setTimeout(() => (window.location.href = "/onboarding"), 1500);
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
					className="flex flex-col leading-none group w-fit relative z-20"
				>
					<span className="text-3xl font-black tracking-tighter text-black group-hover:text-gold transition-colors">
						SAX<span className="text-gold">·</span>RAPID
					</span>
					<span className="text-[10px] font-black tracking-[0.6em] text-gray-400 uppercase mt-1">
						Vendor Center
					</span>
				</Link>

				<div className="relative z-10">
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
					<div className="mb-10 lg:hidden text-center">
						<Link
							href="/"
							className="flex flex-col leading-none group w-fit mx-auto"
						>
							<span className="text-2xl font-black tracking-tighter text-black">
								SAX<span className="text-gold">·</span>RAPID
							</span>
						</Link>
					</div>

					<div className="text-center mb-10">
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
								placeholder="0  0  0  0  0  0"
								className="bg-transparent border-b-2 border-gray-100 text-center text-5xl font-black tracking-[0.4em] text-black outline-none focus:border-gold transition-all w-full max-w-xs py-6 placeholder:text-gray-100"
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
										onClick={() => setTimer(45)}
										className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-black transition-colors underline underline-offset-4"
									>
										Resend Code Now
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
