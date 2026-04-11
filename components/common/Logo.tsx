import React from "react";
import Image from "next/image";

interface LogoProps {
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
	showCaption?: boolean;
	withBackground?: boolean;
}

export function Logo({
	className = "",
	size = "md",
	showCaption = false,
	withBackground = false,
}: LogoProps) {
	const sizes = {
		sm: {
			width: 100,
			height: 40,
			subtext: "text-[6px]",
		},
		md: {
			width: 120,
			height: 48,
			subtext: "text-[8px]",
		},
		lg: {
			width: 160,
			height: 64,
			subtext: "text-[12px]",
		},
		xl: {
			width: 240,
			height: 96,
			subtext: "text-[16px]",
		},
	};

	const currentSize = sizes[size];

	return (
		<div
			className={`flex flex-col ${className.includes("items-") ? "" : "items-center"} ${className}`}
		>
			<div
				className="relative shrink-0"
				style={{ width: currentSize.width, height: currentSize.height }}
			>
				<Image
					src="/assets/icons/SaxRapid-Logo.png"
					alt="SAX-RAPID Logo"
					fill
					className={`object-contain transition-all ${
						withBackground ? "bg-black px-2 rounded" : ""
					}`}
					priority
				/>
			</div>
			{showCaption && (
				<span
					className={`${currentSize.subtext} font-black tracking-[0.6em] text-gray-500 uppercase mt-1 select-none whitespace-nowrap`}
				>
					Vendor Center
				</span>
			)}
		</div>
	);
}
