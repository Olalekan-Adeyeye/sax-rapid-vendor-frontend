"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
    MessageSquare, 
    Star, 
    User, 
    Calendar, 
    Filter, 
    ShoppingBag,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import * as reviewsService from "@/lib/api/services/reviews";
import * as productsService from "@/lib/api/services/products";
import { PagedReviewResponseDTO, ReviewSummaryDTO, ReviewResponseDTO } from "@/lib/api/types/reviews.types";
import { ProductResponseDTO } from "@/lib/api/types/products.types";
import { formatDate } from "@/lib/utils/date";
import { useToast } from "@/lib/context/ToastContext";

function ReviewsContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<PagedReviewResponseDTO | null>(null);
    const [summary, setSummary] = useState<ReviewSummaryDTO | null>(null);
    const [product, setProduct] = useState<ProductResponseDTO | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            if (productId) {
                const [reviewsData, summaryData, productData] = await Promise.all([
                    reviewsService.getProductReviews(productId),
                    reviewsService.getProductReviewSummary(productId),
                    productsService.getProductById(productId)
                ]);
                setReviews(reviewsData);
                setSummary(summaryData);
                setProduct(productData);
            } else {
                const reviewsData = await reviewsService.getMyReviews();
                setReviews(reviewsData);
                // For all reviews, we might want a global summary but API usually provides per product
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            toast("Error", "Failed to load reviews data", "error");
        } finally {
            setLoading(false);
        }
    }, [productId, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-gold" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading marketplace feedback...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <PageHeader 
                title={productId ? `Base Feedback: ${product?.name}` : "Marketplace Reviews"}
                description={productId ? "Deep dive into customer satisfaction for this product" : "Monitor all customer feedback across your store"}
            />

            {/* Analytics Section */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white border border-gray-100 p-8 rounded flex flex-col justify-center items-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Average Score</p>
                        <h2 className="text-4xl font-black text-black">{summary.averageRating.toFixed(1)}</h2>
                        <div className="flex items-center gap-1 text-gold mt-2">
                             {[1, 2, 3, 4, 5].map(s => (
                                 <Star key={s} size={14} fill={s <= Math.round(summary.averageRating) ? "currentColor" : "none"} />
                             ))}
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-white border border-gray-100 p-8 rounded space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Rating Distribution</p>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map(r => {
                                const count = summary.ratingDistribution[r as keyof typeof summary.ratingDistribution] || 0;
                                const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                                return (
                                    <div key={r} className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-gray-400 w-4">{r}</span>
                                        <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                            <div className="h-full bg-black transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-black w-8 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="bg-black text-white p-8 rounded flex flex-col justify-center items-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Total Feedback</p>
                        <h2 className="text-4xl font-black text-gold">{summary.totalReviews}</h2>
                        <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase">Lifetime Reviews</p>
                    </div>
                </div>
            )}

            {/* Filter & Search */}
            <div className="bg-white border border-gray-100 rounded overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="bg-gray-50 border-none font-black text-[10px] uppercase tracking-widest px-6">
                            <Filter size={14} className="text-gold" /> Filter
                        </Button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                            Showing {reviews?.items?.length || 0} relative responses
                        </span>
                    </div>
                    <SearchInput 
                        placeholder="Search feedback content..." 
                        value={searchTerm}
                        onChange={setSearchTerm}
                        variant="muted"
                        focusColor="gold"
                    />
                </div>

                <div className="divide-y divide-gray-50">
                    {reviews?.items && reviews.items.length > 0 ? (
                        reviews.items.map((review: ReviewResponseDTO) => (
                            <div key={review.id} className="p-8 hover:bg-gray-50/30 transition-all flex flex-col md:flex-row gap-8">
                                <div className="md:w-64 shrink-0 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-gray-50">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-black uppercase tracking-tight">{review.userName || "Verified Buyer"}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">CUSTOMER ID: #{review.userId?.substring(0,6)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gold">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(new Date(review.createdAt))}</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="bg-gray-50/50 border border-gray-100 p-6 rounded relative">
                                        <div className="absolute -left-2 top-6 w-4 h-4 bg-gray-50 border-l border-b border-gray-100 rotate-45" />
                                        <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                                            &ldquo;{review.comment || "The buyer didn't leave a written review, only a star rating."}&rdquo;
                                        </p>
                                    </div>
                                    {review.productName && !productId && (
                                        <div className="flex items-center gap-2 text-gold">
                                            <ShoppingBag size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">PRODUCT: {review.productName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-32 text-center flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-100 border border-gray-100">
                                <MessageSquare size={40} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-black uppercase tracking-widest">No Feedback Yet</h3>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Reviews for your products will appear here once buyers leave their thoughts</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ReviewsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-gold" />
            </div>
        }>
            <ReviewsContent />
        </Suspense>
    );
}
