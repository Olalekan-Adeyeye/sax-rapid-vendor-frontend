import React from "react";
import { FormField } from "./FormField";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	id: string;
	required?: boolean;
	error?: string;
	helpText?: string;
	hideAsterisk?: boolean;
	leftSlot?: React.ReactNode;
	rightSlot?: React.ReactNode;
	outerClassName?: string;
	ref?: React.Ref<HTMLInputElement>;
	disableAutofill?: boolean;
}

export function Input({
	label,
	id,
	required,
	error,
	helpText,
	hideAsterisk,
	leftSlot,
	rightSlot,
	className = "",
	outerClassName = "",
	ref,
	disableAutofill,
	type,
	...props
}: InputProps) {
	const effectiveType = disableAutofill && type === "password" ? "text" : type;

	return (
		<FormField
			label={label}
			id={id}
			required={required}
			error={error}
			helpText={helpText}
			hideAsterisk={hideAsterisk}
			className={outerClassName}
		>
			<div className="relative flex items-center">
				{leftSlot && (
					<div className="absolute left-5 z-10 flex items-center justify-center pointer-events-none text-gray-400">
						{leftSlot}
					</div>
				)}
				<input
					id={id}
					ref={ref}
					required={required}
					type={effectiveType}
					className={`w-full bg-white border border-gray-200 focus:border-gold text-black text-sm font-medium rounded px-5 py-3.5 placeholder-gray-400 outline-none transition-all appearance-none 
						${leftSlot ? "pl-12!" : "pl-5!"} 
						${rightSlot ? "pr-12!" : "pl-4!"} 
						${disableAutofill && type === "password" ? "[-webkit-text-security:disc] [input-security:disc]" : ""}
						${className}`}
					{...props}
				/>
				{rightSlot && (
					<div className="absolute right-5 flex items-center justify-center text-gray-400">
						{rightSlot}
					</div>
				)}
			</div>
		</FormField>
	);
}
