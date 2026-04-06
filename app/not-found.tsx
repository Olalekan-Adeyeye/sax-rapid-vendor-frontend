import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-white flex flex-col">
			{/* Center content */}
			<div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
				{/* Large 404 */}
				<h1 className="text-[96px] md:text-[160px] font-black tracking-tighter leading-none text-black mb-6 select-none">
					404
				</h1>

				{/* Thin gold rule */}
				<div className="w-8 h-0.5 bg-gold mb-8" />

				{/* Message */}
				<p className="text-[14px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3">
					Page Not Found
				</p>
				<p className="text-[14px] text-gray-400 max-w-xs leading-relaxed mb-14">
					The page you are looking for doesn&apos;t exist or has been moved to
					another location.
				</p>

				{/* CTAs */}
				<div className="flex flex-col sm:flex-row items-center gap-3">
					<Link
						href="/"
						className="px-10 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-none"
					>
						Go to Dashboard
					</Link>
					<Link
						href=""
						className="px-10 py-4 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all flex items-center gap-2"
					>
						<ArrowLeft size={14} />
						Go Back
					</Link>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="h-16 border-t border-gray-100 px-8 flex items-center justify-center">
				<span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
					sax-rapid.com &nbsp;·&nbsp; All rights reserved
				</span>
			</div>
		</div>
	);
}
