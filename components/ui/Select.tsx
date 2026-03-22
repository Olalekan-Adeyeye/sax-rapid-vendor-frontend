import { ChevronDown, ChevronRightIcon } from "lucide-react";
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	id: string;
	options: { label: string; value: string }[];
	leftSlot?: React.ReactNode;
}

export function Select({
	label,
	id,
	options,
	leftSlot,
	className = "",
	...props
}: SelectProps) {
	return (
		<div className="flex flex-col gap-2">
			{label && (
				<label
					htmlFor={id}
					className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1"
				>
					{label}
				</label>
			)}
			<div className="relative group">
				{leftSlot && (
					<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 transition-colors group-focus-within:text-gold">
						{leftSlot}
					</div>
				)}
				<select
					id={id}
					className={`w-full bg-gray-50 border border-gray-200 text-black text-sm rounded ${
						leftSlot ? "pl-12" : "px-4"
					} pr-10 py-3.5 placeholder-gray-400 appearance-none outline-none focus:border-gold focus:bg-white transition-all font-medium  ${className}`}
					{...props}
				>
					<option value="" disabled className="bg-white text-gray-400">
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
				<ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]" />
			</div>
		</div>
	);
}
