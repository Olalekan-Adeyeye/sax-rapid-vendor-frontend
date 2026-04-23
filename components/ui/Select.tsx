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
	rightSlot?: React.ReactNode;
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
	rightSlot,
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
					className={`w-full bg-white border border-gray-300 focus:border-gold text-black text-sm font-medium rounded ${
						leftSlot ? "pl-12" : "px-5"
					} pr-12 py-3.5 appearance-none outline-none transition-all cursor-pointer ${className}`}
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
				<div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
					{rightSlot}
					<ChevronDown size={14} className={rightSlot ? "text-gray-300" : ""} />
				</div>
			</div>
		</FormField>
	);
}
