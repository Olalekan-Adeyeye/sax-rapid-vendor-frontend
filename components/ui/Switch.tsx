"use client";

import React from "react";

interface SwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
}

export function Switch({ checked, onChange, disabled }: SwitchProps) {
	return (
		<button
			type="button"
			onClick={() => !disabled && onChange(!checked)}
			className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
				checked ? "bg-gold" : "bg-gray-200"
			} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
		>
			<span
				aria-hidden="true"
				className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
					checked ? "translate-x-6" : "translate-x-0"
				}`}
			/>
		</button>
	);
}
