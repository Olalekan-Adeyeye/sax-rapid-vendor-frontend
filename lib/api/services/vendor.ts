/**
 * Vendor Services
 * All endpoints under the "Vendor" tag — /api/Vendor/*
 */

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  CreateVendorProfileRequest,
  UpdateVendorProfileRequest,
  UploadDocumentsRequest,
  UpgradeToBusinessRequest,
  VendorProfileResponse,
  VendorReviewItem,
  VendorReviewSummaryResponse,
} from "../types/vendor.types";

const BASE = "/Vendor";

/**
 * POST /api/Vendor/profile
 * Registers the current user as a vendor/seller.
 * Upgrades user role from Buyer → Seller.
 */
export async function createVendorProfile(
  data: CreateVendorProfileRequest
): Promise<VendorProfileResponse> {
  const response = await apiClient.post<ApiResponse<VendorProfileResponse>>(`${BASE}/profile`, data);
  return response.data.data;
}

/**
 * GET /api/Vendor/profile
 * Retrieves the currently authenticated vendor's own profile.
 */
export async function getMyVendorProfile(): Promise<VendorProfileResponse> {
  const response = await apiClient.get<ApiResponse<VendorProfileResponse>>(`${BASE}/profile`);
  return response.data.data;
}

/**
 * PUT /api/Vendor/profile
 * Updates the current vendor's store details, logo, banner, description.
 */
export async function updateVendorProfile(
  data: UpdateVendorProfileRequest
): Promise<VendorProfileResponse> {
  const response = await apiClient.put<ApiResponse<VendorProfileResponse>>(`${BASE}/profile`, data);
  return response.data.data;
}

/**
 * GET /api/Vendor/{vendorId}
 * Retrieves a vendor's public profile by their ID.
 */
export async function getVendorById(vendorId: string): Promise<VendorProfileResponse> {
  const response = await apiClient.get<ApiResponse<VendorProfileResponse>>(`${BASE}/${vendorId}`);
  return response.data.data;
}

/**
 * POST /api/Vendor/profile/documents
 * Links uploaded document URLs to the vendor profile.
 * Submits the vendor profile for admin review.
 */
export async function uploadVendorDocuments(
  data: UploadDocumentsRequest
): Promise<void> {
  await apiClient.post(`${BASE}/profile/documents`, data);
}

/**
 * POST /api/Vendor/upgrade-to-business
 * Upgrades an individual vendor account to a business vendor account
 */
export async function upgradeToBusiness(
  data: UpgradeToBusinessRequest
): Promise<VendorProfileResponse> {
  const response = await apiClient.post<ApiResponse<VendorProfileResponse>>(`${BASE}/upgrade-to-business`, data);
  return response.data.data;
}

/**
 * GET /api/Vendor/{vendorId}/reviews/summary
 * Average rating, total count and 1–5 star breakdown for a vendor.
 */
export async function getVendorReviewSummary(
  vendorId: string
): Promise<VendorReviewSummaryResponse> {
  const response = await apiClient.get<ApiResponse<VendorReviewSummaryResponse>>(`${BASE}/${vendorId}/reviews/summary`);
  return response.data.data;
}

/**
 * GET /api/Vendor/{vendorId}/reviews
 * Paginated reviewer comments and ratings for a vendor's storefront.
 */
export async function getVendorReviews(
  vendorId: string,
  pageNumber = 1,
  pageSize = 5
): Promise<VendorReviewItem[]> {
  const response = await apiClient.get<ApiResponse<{ items?: VendorReviewItem[] | null }>>(`${BASE}/${vendorId}/reviews`, {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return response.data.data.items ?? [];
}
