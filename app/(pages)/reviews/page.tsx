"use client";
import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/PageHeader";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import {
  MessageSquare,
  Star,
  User,
  Calendar,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import * as reviewsService from "@/lib/api/services/reviews";
import * as productsService from "@/lib/api/services/products";
import { formatDate } from "@/lib/utils/date";

const PAGE_SIZE = 10;

function ReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const searchTerm = searchParams.get("search") || "";
  const sortFilter = searchParams.get("sort") || "newest";
  const ratingFilter = searchParams.get("rating") || "all";
  const [currentPage, setCurrentPage] = useState(1);

  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () =>
      productId
        ? reviewsService.getProductReviews(productId)
        : reviewsService.getMyReviews(),
  });

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["review-summary", productId],
    queryFn: () =>
      productId ? reviewsService.getProductReviewSummary(productId) : null,
    enabled: !!productId,
  });

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () =>
      productId ? productsService.getProductById(productId) : null,
    enabled: !!productId,
  });

  const reviews = reviewsData?.items || [];
  const loading = loadingReviews || loadingSummary || loadingProduct;

  const handleFilterChange = (params: URLSearchParams) => {
    setCurrentPage(1);
    router.push(`/reviews?${params.toString()}`);
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (ratingFilter !== "all" && review.rating !== Number(ratingFilter))
        return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          review.comment?.toLowerCase().includes(q) ||
          review.userName?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [reviews, ratingFilter, searchTerm]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortFilter === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortFilter === "rating_desc") return b.rating - a.rating;
      if (sortFilter === "rating_asc") return a.rating - b.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredReviews, sortFilter]);

  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / PAGE_SIZE));
  const displayedReviews = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedReviews.slice(start, start + PAGE_SIZE);
  }, [sortedReviews, currentPage]);

  if (loading) {
    return <FullPageLoader label="Loading reviews..." icon={Star} />;
  }

  return (
    <div className="space-y-12">
      <PageHeader
        title={
          productId ? `Base Feedback: ${product?.name}` : "Marketplace Reviews"
        }
        description={
          productId
            ? "Deep dive into customer satisfaction for this product"
            : "Monitor all customer feedback across your store"
        }
      />

      {/* Analytics Section */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-100 p-8 rounded flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
              Average Score
            </p>
            <h2 className="text-4xl font-black text-black">
              {summary.averageRating.toFixed(1)}
            </h2>
            <div className="flex items-center gap-1 text-gold mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  fill={
                    s <= Math.round(summary.averageRating)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-2 bg-white border border-gray-100 p-8 rounded space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Rating Distribution
            </p>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((r) => {
                const count =
                  summary.ratingDistribution[
                    r as keyof typeof summary.ratingDistribution
                  ] || 0;
                const percentage =
                  summary.totalReviews > 0
                    ? (count / summary.totalReviews) * 100
                    : 0;
                return (
                  <div key={r} className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 w-4">
                      {r}
                    </span>
                    <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div
                        className="h-full bg-black transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-black w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-black text-white p-8 rounded flex flex-col justify-center items-center text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
              Total Feedback
            </p>
            <h2 className="text-4xl font-black text-gold">
              {summary.totalReviews}
            </h2>
            <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase">
              Lifetime Reviews
            </p>
          </div>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchInput
              placeholder="Search feedback content..."
              value={searchInput}
              onChange={setSearchInput}
              onSearch={(val) => {
                const params = new URLSearchParams(searchParams.toString());
                if (val) params.set("search", val);
                else params.delete("search");
                handleFilterChange(params);
              }}
              variant="muted"
              fullWidth
              focusColor="gold"
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              id="sortFilter"
              value={sortFilter}
              onChange={(e) => {
                const val = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (val && val !== "newest") params.set("sort", val);
                else params.delete("sort");
                handleFilterChange(params);
              }}
              options={[
                { label: "Sort: Newest", value: "newest" },
                { label: "Sort: Oldest", value: "oldest" },
                { label: "Rating: High to Low", value: "rating_desc" },
                { label: "Rating: Low to High", value: "rating_asc" },
              ]}
              outerClassName="w-44 mb-0"
              className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
            />
            <Select
              id="ratingFilter"
              value={ratingFilter}
              onChange={(e) => {
                const val = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (val && val !== "all") params.set("rating", val);
                else params.delete("rating");
                handleFilterChange(params);
              }}
              options={[
                { label: "All Ratings", value: "all" },
                { label: "★★★★★ (5)", value: "5" },
                { label: "★★★★☆ (4)", value: "4" },
                { label: "★★★☆☆ (3)", value: "3" },
                { label: "★★☆☆☆ (2)", value: "2" },
                { label: "★☆☆☆☆ (1)", value: "1" },
              ]}
              outerClassName="w-40 mb-0"
              className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {displayedReviews.length > 0 ? (
            displayedReviews.map((review) => (
              <div
                key={review.id}
                className="p-8 hover:bg-gray-50/30 transition-all flex flex-col md:flex-row gap-8"
              >
                <div className="md:w-64 shrink-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-gray-50">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-black uppercase tracking-tight">
                        {review.userName || "Verified Buyer"}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        CUSTOMER ID: #{review.userId?.substring(0, 6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {formatDate(new Date(review.createdAt))}
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="bg-gray-50/50 border border-gray-100 p-6 rounded relative">
                    <div className="absolute -left-2 top-6 w-4 h-4 bg-gray-50 border-l border-b border-gray-100 rotate-45" />
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      &ldquo;
                      {review.comment ||
                        "The buyer didn't leave a written review, only a star rating."}
                      &rdquo;
                    </p>
                  </div>
                  {review.productName && !productId && (
                    <div className="flex items-center gap-2 text-gold">
                      <ShoppingBag size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        PRODUCT: {review.productName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={MessageSquare} title="No Feedback Yet" />
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-8 py-4 border-t border-gray-50 bg-gray-50/20">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalCount={sortedReviews.length}
              pageSize={PAGE_SIZE}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-gold" />
        </div>
      }
    >
      <ReviewsContent />
    </Suspense>
  );
}
