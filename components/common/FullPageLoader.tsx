"use client";
import React from "react";
import { Loader2, LucideIcon } from "lucide-react";

interface FullPageLoaderProps {
	label?: string;
	icon?: LucideIcon;
	className?: string;
}

/**
 * A reusable full-page loader for the dashboard content area.
 * Inspired by the premium sync styling used across the vendor dashboard.
 */
export function FullPageLoader({
	label = "Synchronizing Data...",
	icon: Icon,
	className = "min-h-[70vh]",
}: FullPageLoaderProps) {
	return (
		<div
			className={`flex flex-col items-center justify-center space-y-4 w-full ${className}`}
		>
			<div className="relative w-16 h-16">
				{/* Primary Spinner */}
				<Loader2
					className="w-full h-full text-gold animate-spin"
					strokeWidth={1.5}
				/>

				{/* Optional Center Icon */}
				{Icon && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Icon size={16} className="text-black" />
					</div>
				)}
			</div>

			{/* Animated Label */}
			<p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse text-center px-4">
				{label}
			</p>
		</div>
	);
}
