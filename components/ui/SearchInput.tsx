"use client";
import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
	/** Controlled value */
	value?: string;
	/** onChange handler */
	onChange?: (value: string) => void;
	/** Placeholder text – defaults to "Search..." */
	placeholder?: string;
	/** Additional classes on the outer wrapper div */
	className?: string;
	/**
	 * Background variant.
	 * - "white"  → white bg with gray-100 border
	 * - "muted"  → gray-50 bg with gray-100 border
	 */
	variant?: "white" | "muted";
	/**
	 * Focus ring color.
	 * - "black" → border-black on focus (default)
	 * - "gold"  → border-gold/30 on focus
	 */
	focusColor?: "black" | "gold";
	/** When true the input fills its container entirely (w-full) */
	fullWidth?: boolean;
	/** Input id – useful for accessibility */
	id?: string;
}

const variantMap = {
	white: "bg-white border-gray-100",
	muted: "bg-gray-50 border-gray-100",
};

const focusMap = {
	black: "focus:border-black hover:border-black",
	gold: "focus:border-gold/30 hover:border-gold/30",
};

export function SearchInput({
	value,
	onChange,
	placeholder = "Search...",
	className = "",
	variant = "muted",
	focusColor = "black",
	fullWidth = false,
	id,
}: SearchInputProps) {
	const v = variantMap[variant];
	const f = focusMap[focusColor];

	return (
		<div className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
			<Search
				className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`}
				size={16}
			/>
			<input
				id={id}
				type="text"
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				placeholder={placeholder}
				className={`${fullWidth ? "w-full" : ""} ${v} border rounded py-3 pl-12 pr-4 text-sm font-semibold text-black outline-none ${f} transition-all placeholder:text-gray-400`}
			/>
		</div>
	);
}
