import Link from "next/link";
import { LandingNav } from "@/components/vendor/LandingNav";
import { Logo } from "@/components/common/Logo";
import { NAV_LINKS } from "@/lib/constants/navLinks";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-white font-sans antialiased text-black">
			<LandingNav navLinks={NAV_LINKS} />
			{children}
			<footer className="bg-black text-white pt-16 pb-8">
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-10 border-b border-white/10">
						<Link href="/" className="inline-block">
							<Logo size="md" withBackground />
						</Link>
						<p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
							&copy; 2026 SAX-RAPID Vendor Center. All Rights Reserved.
						</p>
						<div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-600">
							<Link href="/" className="hover:text-white transition-colors">
								Privacy Policy
							</Link>
							<Link href="/" className="hover:text-white transition-colors">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}
