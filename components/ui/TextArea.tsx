import React from "react";
import { FormField } from "./FormField";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	id: string;
	required?: boolean;
	error?: string;
	helpText?: string;
	hideAsterisk?: boolean;
	outerClassName?: string;
	ref?: React.Ref<HTMLTextAreaElement>;
}

export function TextArea({
	label,
	id,
	required,
	error,
	helpText,
	hideAsterisk,
	className = "",
	outerClassName = "",
	rows = 4,
	ref,
	...props
}: TextAreaProps) {
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
			<textarea
				id={id}
				ref={ref}
				required={required}
				rows={rows}
				className={`w-full bg-white border border-gray-300 focus:border-gold text-black text-sm font-medium rounded px-5 py-3.5 placeholder-gray-400 outline-none transition-all resize-none 
					${className}`}
				{...props}
			/>
		</FormField>
	);
}
