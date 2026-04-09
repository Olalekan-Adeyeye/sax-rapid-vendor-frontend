/**
 * Reviews Services
 * Strictly following swagger.json
 */

import apiClient from "../apiClient";
import { ApiResponse } from "../types/auth.types";
import {
	CreateProductReviewRequestDTO,
	UpdateProductReviewRequestDTO,
	ReviewSummaryDTO,
	PagedReviewResponseDTO,
} from "../types/reviews.types";

const BASE = "/Reviews";

/**
 * GET /api/Reviews/product/{productId}
 * Get product reviews
 */
export async function getProductReviews(
	productId: string,
	page = 1,
	pageSize = 20,
): Promise<PagedReviewResponseDTO> {
	const response = await apiClient.get<ApiResponse<PagedReviewResponseDTO>>(
		`${BASE}/product/${productId}`,
		{
			params: { page, pageSize },
		},
	);
	return response.data.data;
}

/**
 * GET /api/Reviews/product/{productId}/summary
 * Get product rating summary
 */
export async function getProductReviewSummary(
	productId: string,
): Promise<ReviewSummaryDTO> {
	const response = await apiClient.get<ApiResponse<ReviewSummaryDTO>>(
		`${BASE}/product/${productId}/summary`,
	);
	return response.data.data;
}

/**
 * GET /api/Reviews/my
 * Get my reviews
 */
export async function getMyReviews(
	page = 1,
	pageSize = 20,
): Promise<PagedReviewResponseDTO> {
	const response = await apiClient.get<ApiResponse<PagedReviewResponseDTO>>(
		`${BASE}/my`,
		{
			params: { page, pageSize },
		},
	);
	return response.data.data;
}

/**
 * POST /api/Reviews
 * Create a product review
 */
export async function createReview(
	data: CreateProductReviewRequestDTO,
): Promise<void> {
	await apiClient.post(`${BASE}`, data);
}

/**
 * PUT /api/Reviews/{reviewId}
 * Update a review
 */
export async function updateReview(
	reviewId: string,
	data: UpdateProductReviewRequestDTO,
): Promise<void> {
	await apiClient.put(`${BASE}/${reviewId}`, data);
}

/**
 * DELETE /api/Reviews/{reviewId}
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<void> {
	await apiClient.delete(`${BASE}/${reviewId}`);
}
