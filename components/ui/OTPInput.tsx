"use client";

import React, { useRef } from "react";

interface OTPInputProps {
	length?: number;
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function OTPInput({
	length = 6,
	value,
	onChange,
	disabled,
}: OTPInputProps) {
	const inputs = useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		const val = e.target.value;
		if (isNaN(Number(val))) return;

		const newValue = value.split("");
		newValue[index] = val.slice(-1);
		const updatedValue = newValue.join("");
		onChange(updatedValue);

		if (val && index < length - 1) {
			inputs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			inputs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const data = e.clipboardData.getData("text").slice(0, length);
		if (isNaN(Number(data))) return;
		onChange(data);
		inputs.current[data.length - 1 || 0]?.focus();
	};

	return (
		<div className="flex gap-2 justify-center">
			{Array.from({ length }).map((_, i) => (
				<input
					key={i}
					ref={(el) => {
						inputs.current[i] = el;
					}}
					type="text"
					inputMode="numeric"
					maxLength={1}
					value={value[i] || ""}
					onChange={(e) => handleChange(e, i)}
					onKeyDown={(e) => handleKeyDown(e, i)}
					onPaste={handlePaste}
					disabled={disabled}
					className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none transition-colors bg-white disabled:bg-gray-50"
				/>
			))}
		</div>
	);
}
