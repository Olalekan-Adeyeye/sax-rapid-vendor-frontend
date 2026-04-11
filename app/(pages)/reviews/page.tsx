"use client";
import React, { useEffect, useState, useCallback } from "react";
import { 
  Star, 
  MoreVertical, 
  ThumbsUp, 
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import * as reviewsService from "@/lib/api/services/reviews";
import { ReviewResponseDTO, ReviewSummaryDTO } from "@/lib/api/types/reviews.types";
import { useToast } from "@/lib/context/ToastContext";
import { getErrorMessage } from "@/lib/utils/errors";
import { getRelativeTime } from "@/lib/utils/date";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ReviewsPage() {
	const { toast } = useToast();
	
	const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
	const [summary] = useState<ReviewSummaryDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
  
	const fetchReviews = useCallback(async (pageNum: number, isNew = false) => {
		try {
			if (pageNum === 1) {
				setLoading(true);
				setError(null);
			}
      
      // Strictly using documented getMyReviews endpoint
			const data = await reviewsService.getMyReviews(pageNum, 10);
			
			const items = data.items || [];

			if (isNew) {
				setReviews(items);
			} else {
				setReviews(prev => [...prev, ...items]);
			}
			
			setHasMore(data.hasNextPage);
		} catch (error) {
			if (pageNum === 1) {
				setError(getErrorMessage(error));
			} else {
				toast("Error", "Could not load more reviews", "error");
			}
		} finally {
			if (pageNum === 1) setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchReviews(1, true);
	}, [fetchReviews]);

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchReviews(nextPage);
	};

	return (
		<div className="space-y-10 pb-20">
			{error && reviews.length === 0 ? (
				<ErrorComponent 
					title="Failed to load reviews"
					message={error!} 
					onRetry={() => fetchReviews(1, true)} 
				/>
			) : (
				<>
					<PageHeader
						title="Reviews & Ratings"
						description="Live feedback from the marketplace"
						titleClassName="capitalize"
					/>

					{/* Summary Section - Strictly using documented ReviewSummaryDTO fields */}
					{summary && (
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
							<div className="bg-white border border-gray-100 rounded p-8 flex flex-col items-center text-center space-y-3">
								<p className="text-xs font-bold text-gray-500">
									Average Rating
								</p>
								<h3 className="text-4xl font-black text-black">{summary.averageRating}</h3>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((s) => (
										<Star
											key={s}
											size={14}
											className={s <= Math.round(summary.averageRating) ? "fill-gold text-gold" : "text-gray-100"}
										/>
									))}
								</div>
								<p className="text-[10px] font-bold text-gray-400 truncate">
									Based on {summary.totalReviews.toLocaleString()} reviews
								</p>
							</div>
						</div>
					)}

					<div className="space-y-6">
						{loading ? (
							<FullPageLoader label="Loading reviews..." icon={Star} className="bg-white border border-gray-100 rounded p-20" />
						) : reviews.length === 0 ? (
							<div className="bg-white border border-gray-100 rounded p-20 text-center space-y-4">
								<div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center text-gray-300 mx-auto">
									<AlertCircle size={32} />
								</div>
								<div>
									<h4 className="text-lg font-black uppercase tracking-tight">No Reviews Found</h4>
									<p className="text-sm text-gray-400 mt-1">Submit or receive reviews to see them here.</p>
								</div>
							</div>
						) : (
							reviews.map((review) => (
								<div
									key={review.id}
									className="bg-white border border-gray-100 rounded overflow-hidden group hover:border-black transition-colors"
								>
									<div className="p-8">
										<div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
											<div className="flex gap-4">
												<div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300 shrink-0 border border-gray-100 font-black">
													{review.userName?.charAt(0) || "U"}
												</div>
												<div>
													<div className="flex items-center gap-3 mb-1">
														<h4 className="text-sm font-bold text-black">
															{review.userName || "User"}
														</h4>
														<div className="flex gap-0.5">
															{[1, 2, 3, 4, 5].map((s) => (
																<Star
																	key={s}
																	size={10}
																	className={
																		s <= review.rating
																			? "fill-gold text-gold"
																			: "text-gray-100"
																	}
																/>
															))}
														</div>
													</div>
													<p className="text-[10px] font-bold text-gray-400">
														{getRelativeTime(review.createdAt)}
													</p>
												</div>
											</div>
										</div>

										<p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl italic">
											&quot;{review.comment || "No comment provided."}&quot;
										</p>

										<div className="flex items-center gap-6 mt-8">
											<Button
												variant="ghost"
												size="sm"
												className="text-gray-400 hover:text-black transition-colors border-none p-0 h-auto"
											>
												<ThumbsUp size={14} />
												Helpful
											</Button>

											<div className="ml-auto">
												<button className="text-gray-300 hover:text-black transition-colors">
													<MoreVertical size={16} />
												</button>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>

					{hasMore && (
						<Button
							onClick={loadMore}
							variant="outline"
							fullWidth
							className="py-4 text-gray-400 hover:text-black hover:bg-gray-50"
						>
							Load More Reviews
						</Button>
					)}
				</>
			)}
		</div>
	);
}
