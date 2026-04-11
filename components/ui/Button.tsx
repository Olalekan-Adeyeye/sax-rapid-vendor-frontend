import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "black" | "outline" | "link";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	rounded?: "default" | "full" | "lg" | "none";
	loading?: boolean;
	fullWidth?: boolean;
	asChild?: boolean;
	children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
	primary:
		"bg-gold text-black hover:bg-black hover:text-gold disabled:opacity-50",
	secondary:
		"border border-white/10 text-white hover:border-white/30 bg-transparent",
	ghost: "bg-transparent border-transparent text-inherit hover:bg-black/5",
	black:
		"bg-black text-gold hover:bg-gold hover:text-black border border-black hover:border-gold",
	outline:
		"bg-transparent border border-gray-200 text-black hover:bg-black/5 hover:border-black/20",
	link: "bg-transparent border-none text-gold hover:text-black underline underline-offset-4 p-0 h-auto font-black uppercase tracking-widest text-[10px]",
};

const sizeClasses: Record<Size, string> = {
	sm: "text-xs py-3 px-6",
	md: "text-sm py-4 px-8",
	lg: "text-sm py-5 px-10",
};

const roundedClasses = {
	default: "rounded",
	full: "rounded-full",
	lg: "rounded-lg",
	none: "rounded-none",
};

export function Button({
	variant = "primary",
	size = "md",
	rounded = "default",
	loading = false,
	fullWidth = false,
	asChild = false,
	children,
	className = "",
	disabled,
	...props
}: ButtonProps) {
	const baseClasses = `
		flex items-center justify-center gap-3
		font-bold
		transition-all duration-300
		disabled:cursor-not-allowed
		${variantClasses[variant]}
		${sizeClasses[size]}
		${roundedClasses[rounded]}
		${fullWidth ? "w-full" : ""}
		${className}
	`;

	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<{ className?: string }>;
		return React.cloneElement(child, {
			className: `${child.props.className || ""} ${baseClasses}`,
			...props,
		});
	}

	return (
		<button disabled={disabled || loading} className={baseClasses} {...props}>
			{loading ? (
				<>
					<span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0" />
					{children}
				</>
			) : (
				children
			)}
		</button>
	);
}
