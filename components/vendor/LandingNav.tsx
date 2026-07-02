"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/common/Logo";
import type { NavLink } from "@/lib/constants/navLinks";

interface LandingNavProps {
	navLinks: NavLink[];
}

export function LandingNav({ navLinks }: LandingNavProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isMenuOpen]);

	return (
		<>
			{/* Mobile Navigation Overlay */}
			<div
				className={`fixed inset-0 bg-black z-9999 transition-all duration-500 lg:hidden flex flex-col ${
					isMenuOpen
						? "translate-x-0 opacity-100"
						: "translate-x-full opacity-0 pointer-events-none"
				}`}
			>
				<button
					className="absolute top-4 right-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10001"
					onClick={() => setIsMenuOpen(false)}
					aria-label="Close Menu"
				>
					<X size={24} />
				</button>

				<div className="h-full flex flex-col gap-8 p-6 overflow-y-auto">
					<div>
						<Link href="/" onClick={() => setIsMenuOpen(false)}>
							<Logo size="md" className="items-start" withBackground />
						</Link>

						<div className="space-y-6 mt-8">
							<p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">
								Navigation
							</p>
							<nav className="flex flex-col gap-6">
								{navLinks.map((l) => (
									<Link
										key={l.label}
										href={l.href}
										onClick={() => setIsMenuOpen(false)}
										className="text-1xl font-black tracking-tighter text-white hover:text-gold transition-colors"
									>
										{l.label}
									</Link>
								))}
							</nav>
						</div>
					</div>

					<div className="space-y-6 mb-8">
						<p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">
							Account
						</p>
						<div className="flex flex-col gap-4">
							<Link
								href="/login"
								onClick={() => setIsMenuOpen(false)}
								className="text-1xl font-black tracking-tighter text-white flex items-center justify-between group"
							>
								Log in
								<span className="text-gold group-hover:translate-x-2 transition-transform">
									<ArrowRight size={16} />
								</span>
							</Link>
							<Button size="md" fullWidth asChild className="py-4">
								<Link href="/signup" onClick={() => setIsMenuOpen(false)}>
									Start Selling
								</Link>
							</Button>
						</div>
					</div>

					<div className="mt-auto space-y-6 pt-6 border-t border-white/10">
						<div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
							<Link href="/signup" onClick={() => setIsMenuOpen(false)}>
								Become a Seller
							</Link>
							<Link href="/resources" onClick={() => setIsMenuOpen(false)}>
								SAX Academy
							</Link>
							<Link href="/resources" onClick={() => setIsMenuOpen(false)}>
								Seller Resources
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Header */}
			<header className="bg-black border-b border-white/10 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
					<Link
						href="/"
						className="relative z-50 transition-opacity hover:opacity-80"
					>
						<Logo size="md" withBackground />
					</Link>

					<nav className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-gray-300">
						{navLinks.map((l) => (
							<Link
								key={l.label}
								href={l.href}
								className="hover:text-white transition-colors"
							>
								{l.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-4">
						<div className="hidden md:flex items-center gap-4">
							<Link
								href="/login"
								className="text-[11px] font-black uppercase tracking-widest text-gray-300 hover:text-white transition-all"
							>
								Login
							</Link>
							<Button variant="primary" size="sm" asChild>
								<Link href="/signup">Start Selling</Link>
							</Button>
						</div>

						<button
							className="lg:hidden p-2 text-white hover:bg-white/10 rounded transition-colors z-50"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label="Toggle Menu"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</header>
		</>
	);
}
