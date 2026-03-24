import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	id: string;
	leftSlot?: React.ReactNode;
	rightSlot?: React.ReactNode;
}

export function Input({
	label,
	id,
	leftSlot,
	rightSlot,
	className = "",
	...props
}: InputProps) {
	return (
		<div className="flex flex-col gap-2 w-full text-black">
			{label && (
				<label
					htmlFor={id}
					className="text-[10px] font-black uppercase tracking-widest text-gray-500"
				>
					{label}
				</label>
			)}
			<div className="relative flex items-center">
				{leftSlot && (
					<div className="absolute left-4 z-10 flex items-center justify-center pointer-events-none">
						{leftSlot}
					</div>
				)}
				<input
					id={id}
					className={`w-full bg-gray-50 border border-gray-200 text-black text-sm rounded py-3.5 placeholder-gray-400 outline-none focus:border-gold focus:bg-white transition-all font-medium 
						${leftSlot ? "pl-10" : "px-4"} 
						${rightSlot ? "pr-14" : "pr-4"} 
						${className}`}
					{...props}
				/>
				{rightSlot && (
					<div className="absolute right-4 top-1/2 -translate-y-1/2">
						{rightSlot}
					</div>
				)}
			</div>
		</div>
	);
}
