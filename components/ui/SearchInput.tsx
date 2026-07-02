"use client";
import React, { useCallback } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
	/** Controlled value */
	value?: string;
	/** onChange handler */
	onChange?: (value: string) => void;
	/** Called when user clicks search button or presses Enter */
	onSearch?: (value: string) => void;
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
	/** When true the input is disabled */
	disabled?: boolean;
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
	onSearch,
	placeholder = "Search...",
	className = "",
	variant = "muted",
	focusColor = "black",
	fullWidth = false,
	id,
	disabled = false,
}: SearchInputProps) {
	const v = variantMap[variant];
	const f = focusMap[focusColor];

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && onSearch && value !== undefined) {
				onSearch(value);
			}
		},
		[onSearch, value],
	);

	const handleSearchClick = useCallback(() => {
		if (onSearch && value !== undefined) {
			onSearch(value);
		}
	}, [onSearch, value]);

	return (
		<div className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
			<input
				id={id}
				type="text"
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				disabled={disabled}
				className={`${fullWidth ? "w-full" : ""} ${v} border rounded py-3 pl-12 pr-12 text-sm font-semibold text-black outline-none ${f} transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
			/>
			<button
				type="button"
				onClick={handleSearchClick}
				disabled={disabled}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Search"
			>
				<Search size={16} />
			</button>
		</div>
	);
}
