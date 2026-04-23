import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className = "",
}: PaginationProps) {
	const safeTotalPages = Math.max(1, totalPages);

	const handlePrev = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < safeTotalPages) onPageChange(currentPage + 1);
	};

	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;
		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		const end = Math.min(safeTotalPages, start + maxVisible - 1);

		if (end - start + 1 < maxVisible) {
			start = Math.max(1, end - maxVisible + 1);
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	};

	return (
		<div className={`flex items-center justify-center gap-2 ${className}`}>
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
				{getPageNumbers().map((page) => (
					<Button
						key={page}
						onClick={() => onPageChange(page)}
						variant={currentPage === page ? "black" : "outline"}
						size="sm"
						className={`py-2! px-3! transition-colors ${
							currentPage !== page ? "border-gray-100 hover:border-black" : ""
						}`}
					>
						{page}
					</Button>
				))}
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
	);
}
