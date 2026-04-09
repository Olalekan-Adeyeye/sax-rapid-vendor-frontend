"use client";
import React, { useEffect, useState, useCallback } from "react";
import { 
  Star, 
  MoreVertical, 
  ThumbsUp, 
  Loader2,
  AlertCircle
} from "lucide-react";
import * as reviewsService from "@/lib/api/services/reviews";
import { ReviewResponseDTO, ReviewSummaryDTO } from "@/lib/api/types/reviews.types";
import { useToast } from "@/lib/context/ToastContext";
import { getRelativeTime } from "@/lib/utils/date";

export default function ReviewsPage() {
	const { toast } = useToast();
	
	const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
	const [summary] = useState<ReviewSummaryDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
  
	const fetchReviews = useCallback(async (pageNum: number, isNew = false) => {
		try {
			if (pageNum === 1) setLoading(true);
      
      // Strictly using documented getMyReviews endpoint
			const data = await reviewsService.getMyReviews(pageNum, 10);
			
			const items = data.items || [];

			if (isNew) {
				setReviews(items);
			} else {
				setReviews(prev => [...prev, ...items]);
			}
			
			setHasMore(data.hasNextPage);
		} catch {
      toast("Error", "Could not synchronize reviews with the server", "error");
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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="w-12 h-12 text-gold animate-spin" />
					<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading Reviews...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-10 pb-20">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black capitalize">
						Reviews & Ratings
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Live feedback from the marketplace
					</p>
				</div>
			</div>

			{/* Summary Section - Strictly using documented ReviewSummaryDTO fields */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-100 rounded p-8 flex flex-col items-center text-center space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
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
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 truncate">
              Based on {summary.totalReviews.toLocaleString()} reviews
            </p>
          </div>
        </div>
      )}

			<div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded p-20 text-center space-y-4">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
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
              className="bg-white border border-gray-100 rounded overflow-hidden group hover:border-gold transition-colors"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300 shrink-0 border border-gray-100 font-black">
                      {review.userName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-black">
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
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {getRelativeTime(review.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
  
                <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl italic">
                  &quot;{review.comment || "No comment provided."}&quot;
                </p>
  
                <div className="flex items-center gap-6 mt-8">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                    <ThumbsUp size={14} />
                    Helpful
                  </button>
  
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
				<button 
					onClick={loadMore}
					className="w-full py-5 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all"
				>
					Load More Reviews
				</button>
			)}
		</div>
	);
}
