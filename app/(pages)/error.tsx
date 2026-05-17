"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Page render error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
				<h1 className="text-[96px] md:text-[160px] font-black tracking-tighter leading-none text-black mb-6 select-none">
					Oops
				</h1>

				<div className="w-8 h-0.5 bg-gold mb-8" />

				<p className="text-[14px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3">
					Something went wrong
				</p>
				<p className="text-[14px] text-gray-400 max-w-xs leading-relaxed mb-14">
					An unexpected error occurred while rendering this page. Please try
					again.
				</p>

				<div className="flex flex-col sm:flex-row items-center gap-3">
					<button
						onClick={reset}
						className="px-10 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-none flex items-center gap-2"
					>
						<RefreshCw size={14} />
						Try Again
					</button>
					<Link
						href="/dashboard"
						className="px-10 py-4 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all"
					>
						Go to Dashboard
					</Link>
				</div>
			</div>

			<div className="h-16 border-t border-gray-100 px-8 flex items-center justify-center">
				<span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
					sax-rapid.com &nbsp;·&nbsp; All rights reserved
				</span>
			</div>
		</div>
	);
}
