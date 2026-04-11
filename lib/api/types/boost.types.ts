/**
 * Boost Ads Types
 * Derived from the actual API response and swagger.json
 */

export type BoostType = "TopSearch" | "Featured" | "CategorySpotlight";
export type BoostStatus = "Pending" | "Active" | "Expired" | "Cancelled";

/**
 * POST /api/Boost
 */
export interface BoostProductRequestDTO {
  productId: string;
  boostType: BoostType;
  durationDays: number;
}

/**
 * GET /api/Boost/pricing
 */
export interface BoostPricingResponseDTO {
  boostType: BoostType;
  boostTypeName: string;
  pricingByDays: Record<string, number>;
}

/**
 * GET /api/Boost/my
 * GET /api/Boost/product/{productId}
 */
export interface BoostRecordResponseDTO {
  id: string;
  productId: string;
  productName: string;
  boostType: BoostType;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: BoostStatus;
  totalAmount: number;
  amount?: number; // Potential fallback
}
