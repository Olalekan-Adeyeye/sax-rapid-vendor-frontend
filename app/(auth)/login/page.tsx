"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lightbulb, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/common/Logo";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Simple mock login
		setTimeout(() => {
			window.location.href = "/dashboard";
		}, 1500);
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
						Welcome <br />
						Back.
					</h2>
					<p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
						Log in to your account and manage your shop.
					</p>

					<div className="bg-white border border-gray-100 rounded p-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-10 h-10 rounded bg-gold flex items-center justify-center text-black">
								<Lightbulb size={20} fill="currentColor" />
							</div>
							<p className="text-[10px] font-black uppercase tracking-widest text-black">
								Daily Tip
							</p>
						</div>
						<p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
							&quot;Update your stock levels early to maintain your high seller
							score.&quot;
						</p>
					</div>
				</div>
			</div>

			{/* ── MAIN CONTENT ───────────────────────── */}
			<div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-12 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-gold/5 via-white to-white">
				<div className="w-full max-w-sm">
					<div className="mb-10 lg:hidden">
						<Link href="/" className="transition-opacity hover:opacity-80">
							<Logo size="md" />
						</Link>
					</div>

					<div className="mb-10">
						<h1 className="text-4xl font-black text-black tracking-tighter mb-2">
							Sign In.
						</h1>
						<p className="text-gray-500 text-sm font-medium">
							Enter your credentials to continue.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						<Input
							id="email"
							label="Email Address"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
						/>

						<div className="space-y-2">
							<Input
								id="password"
								label="Password"
								type={showPass ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								rightSlot={
									<button
										type="button"
										onClick={() => setShowPass(!showPass)}
										className="text-gray-600 hover:text-black transition-colors p-1"
										aria-label={showPass ? "Hide password" : "Show password"}
									>
										{showPass ? <EyeOff size={16} /> : <Eye size={16} />}
									</button>
								}
							/>
							<div className="flex justify-end">
								<Link
									href="/forgot-password"
									className="text-[10px] font-black uppercase tracking-widest text-black hover:text-gold transition-colors"
								>
									Forgot Password?
								</Link>
							</div>
						</div>

						<Button type="submit" loading={loading} fullWidth className="py-5">
							Login
						</Button>

						<div className="flex items-center gap-4 py-4">
							<div className="flex-1 h-px bg-gray-100" />
							<span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
								or
							</span>
							<div className="flex-1 h-px bg-gray-100" />
						</div>

						<Button
							type="button"
							variant="outline"
							fullWidth
							className="gap-3 transition-all"
						>
							<Image
								src="/assets/icons/google.svg"
								alt="Google"
								width={16}
								height={16}
								className="shrink-0"
							/>
							Sign in with Google
						</Button>
					</form>

					<p className="text-center mt-12 text-gray-400 text-sm font-medium">
						New Merchant?{" "}
						<Link
							href="/signup"
							className="text-gold font-black hover:text-black transition-colors underline-offset-4 hover:underline"
						>
							Join the Empire
						</Link>
					</p>
				</div>

				<p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden">
					© 2026 SAX-RAPID · All Rights Reserved
				</p>
			</div>
		</div>
	);
}
