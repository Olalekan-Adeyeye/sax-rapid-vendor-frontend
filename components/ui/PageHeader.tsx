import React from "react";

interface PageHeaderProps {
	/** The main title of the page */
	title: React.ReactNode;
	/** Optional subtitle or description displayed below the title */
	description?: React.ReactNode;
	/** Optional React nodes (usually Buttons) displayed on the right side of the header */
	actions?: React.ReactNode;
	/** Optional additional styling for the main container */
	className?: string;
	/** Optional additional styling for the title text */
	titleClassName?: string;
}

/**
 * Standardized Page Header component for all vendor dashboard pages.
 * Enforces consistent typography, spacing, and layout.
 */
export function PageHeader({
	title,
	description,
	actions,
	className = "",
	titleClassName = "",
}: PageHeaderProps) {
	return (
		<div
			className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 min-w-0 ${className}`}
		>
			<div className="min-w-0">
				<h2
					className={`text-2xl lg:text-4xl font-black tracking-tighter text-black truncate sm:whitespace-normal ${titleClassName}`}
				>
					{title}
				</h2>
				{description && (
					<p className="text-gray-500 mt-2 text-sm font-medium flex items-center gap-2">
						{description}
					</p>
				)}
			</div>
			{actions && <div className="flex flex-wrap gap-2">{actions}</div>}
		</div>
	);
}
