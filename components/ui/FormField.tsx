import React from "react";

export interface FormFieldProps {
	label?: string;
	id: string;
	required?: boolean;
	error?: string;
	className?: string;
	helpText?: string;
	hideAsterisk?: boolean;
	children: React.ReactNode;
}

export function FormField({
	label,
	id,
	required,
	error,
	helpText,
	hideAsterisk,
	className = "",
	children,
}: FormFieldProps) {
	return (
		<div className={`flex flex-col gap-2.5 w-full ${className}`}>
			{label && (
				<label
					htmlFor={id}
					className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-0.5"
				>
					{label}{" "}
					{required && !hideAsterisk && (
						<span className="text-red-500 ml-0.5">*</span>
					)}
				</label>
			)}
			<div className="relative">{children}</div>
			{helpText && !error && (
				<p className="text-[9px] font-bold text-gray-400 mt-1 px-1">
					{helpText}
				</p>
			)}
			{error && (
				<p className="text-[10px] font-bold text-red-500 px-1">{error}</p>
			)}
		</div>
	);
}
