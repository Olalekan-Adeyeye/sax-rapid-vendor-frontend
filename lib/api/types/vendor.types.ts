/**
 * TypeScript types/DTOs for the Vendor tag
 * Derived from the Sax Rapid Marketplace OpenAPI spec v1
 */

import type { VerificationStatus } from "./auth.types";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type AccountType = "Individual" | "Business";

// ─── Request DTOs ─────────────────────────────────────────────────────────────

/** POST /api/Vendor/profile – Create vendor profile */
export interface CreateVendorProfileRequest {
  shopName: string;
  accountType: AccountType;
  companyName?: string | null;
  businessRegistrationNumber?: string | null;
  storeAddress?: string | null;
  storeCity?: string | null;
  storeState?: string | null;
  storeCountry?: string | null;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  description?: string | null;
  category?: string | null;
}

/** PUT /api/Vendor/profile – Update vendor profile */
export interface UpdateVendorProfileRequest {
  /** 2-200 chars */
  shopName?: string | null;
  companyName?: string | null;
  businessRegistrationNumber?: string | null;
  storeAddress?: string | null;
  storeCity?: string | null;
  storeState?: string | null;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  /** Max 2000 chars */
  description?: string | null;
}

/** POST /api/Vendor/profile/documents – Upload KYC documents */
export interface UploadDocumentsRequest {
  governmentIdUrl?: string | null;
  businessDocumentUrl?: string | null;
}

/** POST /api/Vendor/upgrade-to-business – Upgrade individual to business account */
export interface UpgradeToBusinessRequest {
  companyName: string;
  businessRegistrationNumber: string;
  businessDocumentUrl: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

/** Returned by GET/POST/PUT /api/Vendor/profile and GET /api/Vendor/{vendorId} */
export interface VendorProfileResponse {
  id: string;
  userId: string;
  shopName?: string | null;
  accountType: AccountType;
  companyName?: string | null;
  businessRegistrationNumber?: string | null;
  storeAddress?: string | null;
  storeCity?: string | null;
  storeState?: string | null;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  description?: string | null;
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null; // ISO 8601
  productLimit: number;
  ownerName?: string | null;
  ownerEmail?: string | null;
  createdAt: string; // ISO 8601
  updatedAt?: string | null;
}
