"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, User, Sparkle } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/common/Logo";

export default function SignupPage() {
	const [loading, setLoading] = useState(false);
	const [showPass, setShowPass] = useState(false);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const update = (field: keyof typeof form, value: string) =>
		setForm((f) => ({ ...f, [field]: value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Simulate account creation then redirect to verification
		setTimeout(() => (window.location.href = "/verify"), 1500);
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
						Ready to <br />
						Start?
					</h2>
					<p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
						Join the thousands of sellers growing their business with us.
					</p>

					<div className="space-y-8">
						{[
							"Reach over 5 Million buyers",
							"We handle your delivery",
							"Get paid every week",
							"Get help to grow your sales",
						].map((perk) => (
							<div
								key={perk}
								className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400"
							>
								<Sparkle size={14} className=" fill-current" />
								{perk}
							</div>
						))}
					</div>
				</div>

				<p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 relative z-10">
					© 2026 SAX-RAPID · Seller Account Information
				</p>
			</div>

			{/* ── MAIN CONTENT ───────────────────────── */}
			<div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/5 via-white to-white">
				<div className="w-full max-w-sm">
					<div className="mb-10 lg:hidden">
						<Link href="/" className="transition-opacity hover:opacity-80">
							<Logo size="md" className="items-start" />
						</Link>
					</div>

					<div className="mb-10">
						<h1 className="text-4xl font-black text-black tracking-tighter mb-2">
							Create Account.
						</h1>
						<p className="text-gray-500 text-sm font-medium">
							Provide your details to get started.
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-5 animate-in fade-in slide-in-from-bottom-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<Input
								id="firstName"
								label="First Name"
								type="text"
								placeholder="Arthur"
								value={form.firstName}
								onChange={(e) => update("firstName", e.target.value)}
								required
								leftSlot={<User size={16} className="text-gray-400" />}
							/>
							<Input
								id="lastName"
								label="Last Name"
								type="text"
								placeholder="Morgan"
								value={form.lastName}
								onChange={(e) => update("lastName", e.target.value)}
								required
							/>
						</div>

						<Input
							id="email"
							label="Email Address"
							type="email"
							placeholder="ceo@company.com"
							value={form.email}
							onChange={(e) => update("email", e.target.value)}
							required
							leftSlot={<Mail size={16} className="text-gray-400" />}
						/>

						<div className="grid grid-cols-1 gap-5">
							<Input
								label="Password"
								id="password"
								type={showPass ? "text" : "password"}
								value={form.password}
								onChange={(e) => update("password", e.target.value)}
								required
								leftSlot={<Lock size={16} className="text-gray-400" />}
								rightSlot={
									<button
										type="button"
										onClick={() => setShowPass(!showPass)}
										className="text-[9px] font-black text-gray-400 hover:text-gold transition-colors uppercase"
									>
										{showPass ? "Hide" : "Show"}
									</button>
								}
							/>
							<Input
								label="Confirm Password"
								id="confirmPassword"
								type={showPass ? "text" : "password"}
								value={form.confirmPassword}
								onChange={(f) =>
									setForm((prev) => ({
										...prev,
										confirmPassword: f.target.value,
									}))
								}
								required
								leftSlot={<Lock size={16} className="text-gray-400" />}
							/>
						</div>

						<Button
							fullWidth
							type="submit"
							loading={loading}
							className="mt-2 py-5"
						>
							Next Step
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
							Join with Google
						</Button>
					</form>

					<p className="text-center mt-12 text-gray-400 text-sm font-medium">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-gold font-black hover:text-black transition-colors underline-offset-4 hover:underline"
						>
							Log In
						</Link>
					</p>
				</div>

				<p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden text-center">
					© 2026 SAX-RAPID · Official Merchant Registration
				</p>
			</div>
		</div>
	);
}
