import React from "react";
import Image from "next/image";

interface LogoProps {
	className?: string;
	showText?: boolean;
	size?: "sm" | "md" | "lg" | "xl";
	light?: boolean;
}

export function Logo({
	className = "",
	showText = true,
	size = "md",
	light = false,
}: LogoProps) {
	const sizes = {
		sm: {
			icon: 24,
			text: "text-lg",
			subtext: "text-[6px]",
			gap: "gap-1.5",
		},
		md: {
			icon: 40,
			text: "text-2xl",
			subtext: "text-[8px]",
			gap: "gap-2",
		},
		lg: {
			icon: 56,
			text: "text-4xl",
			subtext: "text-[12px]",
			gap: "gap-3",
		},
		xl: {
			icon: 80,
			text: "text-6xl",
			subtext: "text-[18px]",
			gap: "gap-4",
		},
	};

	const currentSize = sizes[size];
	const primaryColor = light ? "text-white" : "text-black";

	return (
		<div className={`flex items-center ${currentSize.gap} ${className}`}>
			<div
				className="relative shrink-0"
				style={{ width: currentSize.icon, height: currentSize.icon }}
			>
				<Image
					src="/assets/icons/SaxRapid-Logo.png"
					alt="SAX-RAPID Logo"
					fill
					className="object-contain"
					priority
				/>
			</div>

			{showText && (
				<div className="flex flex-col leading-none select-none">
					<span
						className={`${currentSize.text} font-black tracking-tighter ${primaryColor} uppercase`}
					>
						SAX<span className="text-gold">·</span>RAPID
					</span>
					<span
						className={`${currentSize.subtext} font-black tracking-[0.5em] text-gray-400 uppercase mt-0.5`}
					>
						Vendor Center
					</span>
				</div>
			)}
		</div>
	);
}
