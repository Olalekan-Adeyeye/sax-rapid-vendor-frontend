/**
 * Analytics Services
 * All vendor analytics endpoints — /api/vendor/analytics/*
 */

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  VendorDashboardStats,
  VendorPerformanceDataPoint,
  VendorTopSellerPagedResponse,
  VendorPerformanceQueryParams,
  VendorAnalyticsQueryParams,
  VendorTopSellerQueryParams,
} from "../types/analytics.types";

const BASE = "/vendor/analytics";

/**
 * GET /api/vendor/analytics/dashboard
 * Returns overall stats for the vendor including revenue, orders, products, and customers.
 *
 * @param params - Query parameters (dateFrom, dateTo, currency)
 * @returns VendorDashboardStats
 */
export async function getVendorDashboardStats(
  params?: VendorAnalyticsQueryParams,
): Promise<VendorDashboardStats> {
  const response = await apiClient.get<ApiResponse<VendorDashboardStats>>(
    `${BASE}/dashboard`,
    { params },
  );
  return response.data.data;
}

/**
 * GET /api/vendor/analytics/performance
 * Returns time-series performance data for charts.
 * GroupBy can be 'Day', 'Week', 'Month', or 'Year'.
 *
 * @param params - Query parameters (dateFrom, dateTo, groupBy, currency)
 * @returns Array of VendorPerformanceDataPoint
 */
export async function getVendorPerformanceAnalytics(
  params?: VendorPerformanceQueryParams,
): Promise<VendorPerformanceDataPoint[]> {
  const response = await apiClient.get<
    ApiResponse<VendorPerformanceDataPoint[]>
  >(`${BASE}/performance`, { params });
  return response.data.data;
}

/**
 * GET /api/vendor/analytics/top-sellers
 * Returns a paginated list of top selling products for the vendor.
 *
 * @param params - Query parameters (dateFrom, dateTo, pageNumber, pageSize, currency)
 * @returns VendorTopSellerPagedResponse
 */
export async function getVendorTopSellers(
  params?: VendorTopSellerQueryParams,
): Promise<VendorTopSellerPagedResponse> {
  const response = await apiClient.get<
    ApiResponse<VendorTopSellerPagedResponse>
  >(`${BASE}/top-sellers`, { params });
  return response.data.data;
}
