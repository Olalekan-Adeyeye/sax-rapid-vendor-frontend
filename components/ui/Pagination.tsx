import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	/** Total number of items across all pages — enables the "Showing X–Y of Z" label */
	totalCount?: number;
	/** Items per page — required when totalCount is provided */
	pageSize?: number;
	className?: string;
}

function buildPageList(
	currentPage: number,
	totalPages: number,
	siblingCount = 1,
): (number | "ellipsis")[] {
	const range = (lo: number, hi: number) =>
		Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

	const siblingLeft = Math.max(currentPage - siblingCount, 1);
	const siblingRight = Math.min(currentPage + siblingCount, totalPages);

	const showLeftEllipsis = siblingLeft > 2;
	const showRightEllipsis = siblingRight < totalPages - 1;

	if (!showLeftEllipsis && !showRightEllipsis) {
		return range(1, totalPages);
	}

	if (!showLeftEllipsis && showRightEllipsis) {
		return [...range(1, siblingRight), "ellipsis", totalPages];
	}

	if (showLeftEllipsis && !showRightEllipsis) {
		return [1, "ellipsis", ...range(siblingLeft, totalPages)];
	}

	return [
		1,
		"ellipsis",
		...range(siblingLeft, siblingRight),
		"ellipsis",
		totalPages,
	];
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	totalCount,
	pageSize,
	className = "",
}: PaginationProps) {
	const safeTotalPages = Math.max(1, totalPages);
	const hasNav = safeTotalPages > 1;

	const showRange = !!pageSize && totalCount !== undefined && totalCount > 0;
	const rangeStart = showRange ? (currentPage - 1) * pageSize! + 1 : null;
	const rangeEnd = showRange
		? Math.min(currentPage * pageSize!, totalCount!)
		: null;

	// Nothing at all to show — no count label and only one page
	if (!hasNav && !showRange) return null;

	const handlePrev = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < safeTotalPages) onPageChange(currentPage + 1);
	};

	const pages = buildPageList(currentPage, safeTotalPages);

	return (
		<div
			className={`flex items-center justify-between gap-6 w-full ${className}`}
		>
			{/* Range label — left side */}
			{showRange ? (
				<p className="text-[12px] font-bold text-gray-400 whitespace-nowrap">
					Showing{" "}
					<span className="text-black font-black">
						{rangeStart}–{rangeEnd}
					</span>{" "}
					of{" "}
					<span className="text-black font-black">
						{totalCount!.toLocaleString()}
					</span>{" "}
					products
				</p>
			) : (
				<span />
			)}

			{/* Page buttons — right side, only when multiple pages exist */}
			{hasNav && (
				<div className="flex items-center gap-2">
					<Button
						onClick={handlePrev}
						disabled={currentPage === 1}
						variant="outline"
						size="sm"
						className="p-2! border-gray-100 hover:border-black transition-colors"
						aria-label="Previous page"
					>
						<ChevronLeft size={16} />
					</Button>

					<div className="flex items-center gap-1">
						{pages.map((page, idx) =>
							page === "ellipsis" ? (
								<span
									key={`ellipsis-${idx}`}
									className="px-2 py-1 text-xs font-bold text-gray-400 select-none"
									aria-hidden="true"
								>
									…
								</span>
							) : (
								<Button
									key={page}
									onClick={() => onPageChange(page)}
									variant={currentPage === page ? "black" : "outline"}
									size="sm"
									className={`py-2! px-3! transition-colors ${
										currentPage !== page
											? "border-gray-100 hover:border-black"
											: ""
									}`}
									aria-label={`Page ${page}`}
									aria-current={currentPage === page ? "page" : undefined}
								>
									{page}
								</Button>
							),
						)}
					</div>

					<Button
						onClick={handleNext}
						disabled={currentPage >= safeTotalPages}
						variant="outline"
						size="sm"
						className="p-2! border-gray-100 hover:border-black transition-colors"
						aria-label="Next page"
					>
						<ChevronRight size={16} />
					</Button>
				</div>
			)}
		</div>
	);
}
