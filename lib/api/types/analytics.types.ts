/**
 * TypeScript types/DTOs for the Analytics tag
 * Derived from the Sax Rapid Marketplace OpenAPI spec v1
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type PerformanceGroupBy = "Day" | "Week" | "Month" | "Year";

// ─── Vendor Analytics DTOs ────────────────────────────────────────────────────

/** GET /api/vendor/analytics/dashboard – Dashboard Stats */
export interface VendorDashboardStats {
  revenue: number;
  currency?: string | null;
  totalOrders: number;
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  uniqueCustomers: number;
  dateFrom?: string | null; // ISO 8601 date-time
  dateTo?: string | null; // ISO 8601 date-time
}

/** GET /api/vendor/analytics/performance – Performance Data Point */
export interface VendorPerformanceDataPoint {
  date: string; // ISO 8601 date-time
  revenue: number;
  ordersCount: number;
}

/** GET /api/vendor/analytics/top-sellers – Top Seller Item */
export interface VendorTopSeller {
  productId: string; // UUID
  productName?: string | null;
  sku?: string | null;
  unitsSold: number;
  revenueGenerated: number;
  imageUrl?: string | null;
}

/** GET /api/vendor/analytics/top-sellers – Paged Response */
export interface VendorTopSellerPagedResponse {
  items?: VendorTopSeller[] | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ─── Request Query Parameters ─────────────────────────────────────────────────

export interface VendorAnalyticsQueryParams {
  dateFrom?: string; // ISO 8601 date-time
  dateTo?: string; // ISO 8601 date-time
  currency?: string; // Default: "NGN"
}

export interface VendorPerformanceQueryParams extends VendorAnalyticsQueryParams {
  groupBy?: PerformanceGroupBy; // "Day", "Week", "Month", "Year"
}

export interface VendorTopSellerQueryParams extends VendorAnalyticsQueryParams {
  pageNumber?: number; // Default: 1
  pageSize?: number; // Default: 10
}
