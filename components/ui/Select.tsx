import { ChevronDown } from "lucide-react";
import React from "react";
import { FormField } from "./FormField";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	id: string;
	required?: boolean;
	error?: string;
	helpText?: string;
	hideAsterisk?: boolean;
	options: { label: string; value: string | number }[];
	leftSlot?: React.ReactNode;
	outerClassName?: string;
	ref?: React.Ref<HTMLSelectElement>;
}

export function Select({
	label,
	id,
	required,
	error,
	helpText,
	hideAsterisk,
	options,
	leftSlot,
	className = "",
	outerClassName = "",
	ref,
	...props
}: SelectProps) {
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
			<div className="relative group">
				{leftSlot && (
					<div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10 transition-colors group-focus-within:text-gold">
						{leftSlot}
					</div>
				)}
				<select
					id={id}
					ref={ref}
					required={required}
					className={`w-full bg-gray-50 border border-gray-200/50 focus:border-gold/50 text-black text-xs font-bold rounded ${
						leftSlot ? "pl-12" : "px-5"
					} pr-12 py-4 appearance-none outline-none transition-all cursor-pointer ${className}`}
					{...props}
				>
					<option value="" disabled>
						Select an option
					</option>
					{options.map((opt) => (
						<option
							key={opt.value}
							value={opt.value}
							className="bg-white text-black"
						>
							{opt.label}
						</option>
					))}
				</select>
				<div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
					<ChevronDown size={14} />
				</div>
			</div>
		</FormField>
	);
}
