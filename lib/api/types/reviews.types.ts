/**
 * TypeScript types for the Reviews module
 * Strictly following swagger.json
 */

export interface CreateProductReviewRequestDTO {
  productId: string;
  orderId?: string | null;
  rating: number; // 1-5
  comment?: string | null;
}

export interface UpdateProductReviewRequestDTO {
  rating: number; // 1-5
  comment?: string | null;
}

// Since Response DTOs were missing schemas in swagger, 
// using inferred structure based on common API patterns
export interface ReviewResponseDTO {
  id: string;
  productId: string;
  orderId?: string | null;
  userId: string;
  userName: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ReviewSummaryDTO {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface PagedReviewResponseDTO {
  items: ReviewResponseDTO[] | null;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
