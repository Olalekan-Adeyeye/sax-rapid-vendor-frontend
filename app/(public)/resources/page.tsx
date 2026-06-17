"use client";
import Link from "next/link";
import {
	BookOpen,
	Video,
	FileText,
	ExternalLink,
	GraduationCap,
	BarChart3,
	Package,
	Wallet,
} from "lucide-react";

const RESOURCES = [
	{
		title: "SAX Academy",
		desc: "In-depth video courses on product photography, pricing strategy, and scaling your online store.",
		icon: <GraduationCap size={28} />,
		color: "bg-gold/10 text-gold",
		href: "#",
	},
	{
		title: "Seller Guides",
		desc: "Step-by-step walkthroughs for listing optimization, inventory management, and order fulfillment.",
		icon: <BookOpen size={28} />,
		color: "bg-blue-50 text-blue-600",
		href: "#",
	},
	{
		title: "Webinars",
		desc: "Live and recorded sessions with top sellers covering growth tactics, marketing, and more.",
		icon: <Video size={28} />,
		color: "bg-purple-50 text-purple-600",
		href: "#",
	},
	{
		title: "Blog",
		desc: "Market insights, platform updates, and success stories from the SAX·RAPID community.",
		icon: <FileText size={28} />,
		color: "bg-green-50 text-green-600",
		href: "#",
	},
];

const QUICK_LINKS = [
	{
		title: "Analytics Guide",
		desc: "Understand your dashboard metrics and make data-driven decisions.",
		icon: <BarChart3 size={20} />,
		href: "#",
	},
	{
		title: "Product Listings",
		desc: "Best practices for creating listings that convert.",
		icon: <Package size={20} />,
		href: "#",
	},
	{
		title: "Payouts & Settlement",
		desc: "Everything about your earnings, withdrawals, and payment schedules.",
		icon: <Wallet size={20} />,
		href: "#",
	},
];

export default function ResourcesPage() {
	return (
		<>
			<section className="py-24 bg-black relative overflow-hidden">
				<div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
				<div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
					<div className="w-10 h-1.5 bg-gold rounded-full mb-6 mx-auto" />
					<h1 className="text-5xl font-black text-white tracking-tighter mb-4">
						Resources
					</h1>
					<p className="text-gray-400 text-lg max-w-xl mx-auto">
						Everything you need to build, grow, and scale your business on
						SAX·RAPID.
					</p>
				</div>
			</section>

			<section className="py-20 bg-gray-50">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{RESOURCES.map((r) => (
							<Link
								key={r.title}
								href={r.href}
								className="group bg-white border border-gray-100 rounded p-8 flex items-start gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
							>
								<div
									className={`w-14 h-14 rounded flex items-center justify-center shrink-0 ${r.color}`}
								>
									{r.icon}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between gap-4 mb-2">
										<h3 className="font-black text-base uppercase tracking-wider">
											{r.title}
										</h3>
										<ExternalLink
											size={16}
											className="text-gray-300 group-hover:text-gold transition-colors shrink-0"
										/>
									</div>
									<p className="text-sm text-gray-500 leading-relaxed">
										{r.desc}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="py-20 bg-white">
				<div className="max-w-4xl mx-auto px-6">
					<h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-8 text-center">
						Quick Links
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{QUICK_LINKS.map((ql) => (
							<Link
								key={ql.title}
								href={ql.href}
								className="flex flex-col items-center text-center p-8 bg-gray-50 border border-gray-100 rounded hover:border-gold hover:shadow-lg transition-all duration-300 group"
							>
								<div className="w-12 h-12 rounded bg-gold/10 flex items-center justify-center text-gold mb-5 group-hover:scale-110 transition-transform">
									{ql.icon}
								</div>
								<h3 className="font-black text-sm uppercase tracking-wider mb-2">
									{ql.title}
								</h3>
								<p className="text-xs text-gray-500 leading-relaxed">
									{ql.desc}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className="py-20 bg-black relative overflow-hidden">
				<div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
				<div className="max-w-2xl mx-auto px-6 relative z-10 text-center">
					<h2 className="text-3xl font-black text-white tracking-tighter mb-4">
						Ready to start selling?
					</h2>
					<p className="text-gray-400 text-sm mb-8">
						Join thousands of vendors already growing on SAX·RAPID.
					</p>
					<Link
						href="/signup"
						className="inline-flex items-center gap-2 bg-gold text-black text-[11px] font-black uppercase tracking-widest px-10 py-5 rounded hover:bg-white transition-all"
					>
						Create Your Store
					</Link>
				</div>
			</section>
		</>
	);
}
