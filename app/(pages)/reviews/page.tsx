"use client";
import { useQuery } from "@tanstack/react-query";
import {
  MessageSquare,
  Star,
  User,
  Calendar,
  ShoppingBag,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useMemo, Suspense } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { Button } from "@/components/ui/Button";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import * as productsService from "@/lib/api/services/products";
import * as reviewsService from "@/lib/api/services/reviews";
import * as vendorService from "@/lib/api/services/vendor";
import type { ReviewSummaryDTO } from "@/lib/api/types/reviews.types";
import type { VendorReviewSummaryResponse } from "@/lib/api/types/vendor.types";
import { useAuth } from "@/lib/context/AuthContext";
import { formatDate } from "@/lib/utils/date";
import { getErrorMessage } from "@/lib/utils/errors";

const PAGE_SIZE = 10;
const VENDOR_REVIEWS_PAGE_SIZE = 100;

interface NormalizedReview {
  key: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  displayName: string;
  customerLine: string | null;
  productLabel: string | null;
}

function toNormalizedReviews(data: unknown): NormalizedReview[] {
  const list = Array.isArray(data)
    ? data
    : (data as { items?: unknown } | null | undefined)?.items;
  if (!Array.isArray(list)) return [];
  return (list as Record<string, unknown>[]).map((entry, index) => {
    const userName =
      typeof entry.userName === "string" ? entry.userName : null;
    const reviewerName =
      typeof entry.reviewerName === "string" ? entry.reviewerName : null;
    const userId = typeof entry.userId === "string" ? entry.userId : null;
    const productName =
      typeof entry.productName === "string" ? entry.productName : null;
    const itemDetails =
      typeof entry.itemDetails === "string" ? entry.itemDetails : null;
    const comment = typeof entry.comment === "string" ? entry.comment : null;
    const createdAt =
      typeof entry.createdAt === "string" ? entry.createdAt : "";
    const id = typeof entry.id === "string" ? entry.id : `review-${index}`;
    return {
      key: id,
      rating: typeof entry.rating === "number" ? entry.rating : 0,
      comment,
      createdAt,
      displayName: userName || reviewerName || "Verified Buyer",
      customerLine: userId ? `CUSTOMER ID: #${userId.substring(0, 6)}` : null,
      productLabel: productName || itemDetails || null,
    };
  });
}

function toTime(value: string): number {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function ReviewsContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const productId = searchParams.get("productId");

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const searchTerm = searchParams.get("search") || "";
  const sortFilter = searchParams.get("sort") || "newest";
  const ratingFilter = searchParams.get("rating") || "all";
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: vendor,
    isLoading: loadingVendor,
    error: vendorError,
    refetch: refetchVendor,
  } = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: vendorService.getMyVendorProfile,
    enabled: isAuthenticated && !productId,
    retry: false,
  });

  const vendorId = vendor?.id || "";

  const {
    data: reviewsData,
    isLoading: loadingReviews,
    error: reviewsQueryError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: productId ? ["reviews", productId] : ["vendor-reviews", vendorId],
    queryFn: async (): Promise<Record<string, unknown>[]> => {
      if (productId) {
        const res = await reviewsService.getProductReviews(productId);
        const items = (res as unknown as { items?: unknown })?.items;
        return Array.isArray(items)
          ? (items as Record<string, unknown>[])
          : [];
      }
      const res = (await vendorService.getVendorReviews(
        vendorId,
        1,
        VENDOR_REVIEWS_PAGE_SIZE,
      )) as unknown;
      if (Array.isArray(res)) return res as Record<string, unknown>[];
      if (res && typeof res === "object") {
        const items = (res as { items?: unknown }).items;
        if (Array.isArray(items)) return items as Record<string, unknown>[];
      }
      return [];
    },
    enabled: isAuthenticated && (productId ? true : !!vendorId),
    retry: false,
  });

  const {
    data: summary,
    isLoading: loadingSummary,
    error: summaryQueryError,
    refetch: refetchSummary,
  } = useQuery<ReviewSummaryDTO | VendorReviewSummaryResponse>({
    queryKey: productId
      ? ["review-summary", productId]
      : ["vendor-review-summary", vendorId],
    queryFn: () =>
      productId
        ? reviewsService.getProductReviewSummary(productId)
        : vendorService.getVendorReviewSummary(vendorId),
    enabled: isAuthenticated && (productId ? true : !!vendorId),
    retry: false,
  });

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () =>
      productId ? productsService.getProductById(productId) : null,
    enabled: !!productId && isAuthenticated,
  });

  const reviews = useMemo(() => toNormalizedReviews(reviewsData), [reviewsData]);

  const breakdown = useMemo(() => {
    if (!summary) return null;
    const record = summary as unknown as Record<string, unknown>;
    const raw =
      (record.starRatingBreakdown as Record<string, number> | null | undefined) ??
      (record.ratingDistribution as Record<string, number> | null | undefined);
    return raw ?? null;
  }, [summary]);

  const averageRating = summary?.averageRating ?? 0;
  const totalReviews = summary?.totalReviews ?? 0;

  const handleFilterChange = (params: URLSearchParams) => {
    setCurrentPage(1);
    router.push(`/reviews?${params.toString()}`);
  };

  const handleRetry = () => {
    refetchSummary();
    refetchReviews();
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (
        ratingFilter !== "all" &&
        Math.round(review.rating) !== Number(ratingFilter)
      )
        return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          review.comment?.toLowerCase().includes(q) ||
          review.displayName.toLowerCase().includes(q) ||
          review.productLabel?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [reviews, ratingFilter, searchTerm]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortFilter === "oldest") return toTime(a.createdAt) - toTime(b.createdAt);
      if (sortFilter === "rating_desc") return b.rating - a.rating;
      if (sortFilter === "rating_asc") return a.rating - b.rating;
      return toTime(b.createdAt) - toTime(a.createdAt);
    });
  }, [filteredReviews, sortFilter]);

  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / PAGE_SIZE));
  const displayedReviews = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedReviews.slice(start, start + PAGE_SIZE);
  }, [sortedReviews, currentPage]);

  if (!productId && loadingVendor) {
    return <FullPageLoader label="Loading reviews..." icon={Star} />;
  }

  if (!productId && (vendorError || !vendorId)) {
    return (
      <ErrorComponent
        title="Store Reviews Unavailable"
        message={
          vendorError
            ? getErrorMessage(vendorError)
            : "We could not resolve your store profile. Please try again."
        }
        onRetry={() => refetchVendor()}
      />
    );
  }

  const reviewsError = reviewsQueryError
    ? getErrorMessage(reviewsQueryError)
    : null;
  const summaryError = summaryQueryError
    ? getErrorMessage(summaryQueryError)
    : null;

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

      {loadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          <div className="bg-white border border-gray-100 p-8 rounded">
            <div className="h-10 bg-gray-50 rounded" />
            <div className="h-4 bg-gray-50 rounded w-2/3 mt-4" />
          </div>
          <div className="md:col-span-2 bg-white border border-gray-100 p-8 rounded space-y-3">
            <div className="h-4 bg-gray-50 rounded w-1/3" />
            <div className="h-4 bg-gray-50 rounded" />
            <div className="h-4 bg-gray-50 rounded" />
            <div className="h-4 bg-gray-50 rounded w-1/2" />
          </div>
          <div className="bg-black p-8 rounded">
            <div className="h-10 bg-white/10 rounded" />
          </div>
        </div>
      ) : summaryError ? (
        <div className="bg-white border border-gray-100 rounded p-10">
          <div className="py-6 text-center flex flex-col items-center gap-3 bg-red-50/10 rounded">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-xs font-bold text-red-500">
              Failed to load review summary
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-red-600 hover:bg-red-100 text-[10px] font-black uppercase tracking-widest"
            >
              <RefreshCw size={12} className="mr-2" />
              Retry
            </Button>
          </div>
        </div>
      ) : (
        summary &&
        totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 p-8 rounded flex flex-col justify-center items-center text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                Average Score
              </p>
              <h2 className="text-4xl font-black text-black">
                {averageRating.toFixed(1)}
              </h2>
              <div className="flex items-center gap-1 text-gold mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={
                      s <= Math.round(averageRating) ? "currentColor" : "none"
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
                  const count = breakdown
                    ? (breakdown[String(r)] ?? breakdown[r] ?? 0)
                    : 0;
                  const percentage =
                    totalReviews > 0 ? (count / totalReviews) * 100 : 0;
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
              <h2 className="text-4xl font-black text-gold">{totalReviews}</h2>
              <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase">
                Lifetime Reviews
              </p>
            </div>
          </div>
        )
      )}

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
              disabled={loadingReviews}
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
              optionClassName="text-xs!"
              searchInputClassName="text-xs!"
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
              optionClassName="text-xs!"
              searchInputClassName="text-xs!"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {loadingReviews ? (
            <div className="p-8 space-y-4 animate-pulse">
              <div className="h-16 bg-gray-50 rounded" />
              <div className="h-16 bg-gray-50 rounded" />
              <div className="h-16 bg-gray-50 rounded w-2/3" />
            </div>
          ) : reviewsError ? (
            <div className="py-10 text-center flex flex-col items-center gap-3 bg-red-50/10">
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-xs font-bold text-red-500">
                Failed to load reviews
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {reviewsError}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="text-red-600 hover:bg-red-100 text-[10px] font-black uppercase tracking-widest"
              >
                <RefreshCw size={12} className="mr-2" />
                Retry
              </Button>
            </div>
          ) : displayedReviews.length > 0 ? (
            displayedReviews.map((review) => (
              <div
                key={review.key}
                className="p-8 hover:bg-gray-50/30 transition-all flex flex-col md:flex-row gap-8"
              >
                <div className="md:w-64 shrink-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-gray-50">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-black uppercase tracking-tight">
                        {review.displayName}
                      </p>
                      {review.customerLine && (
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          {review.customerLine}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={
                          s <= Math.round(review.rating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  {review.createdAt && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {formatDate(new Date(review.createdAt))}
                      </span>
                    </div>
                  )}
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
                  {review.productLabel && !productId && (
                    <div className="flex items-center gap-2 text-gold">
                      <ShoppingBag size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        PRODUCT: {review.productLabel}
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
              itemLabel="reviews"
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
