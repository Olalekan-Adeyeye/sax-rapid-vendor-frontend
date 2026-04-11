/**
 * TypeScript types/DTOs for the Subscriptions tag
 * Derived from the Sax Rapid Marketplace OpenAPI spec v1
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type SubscriptionBillingCycle = "Monthly" | "Yearly";

// ─── Request DTOs ─────────────────────────────────────────────────────────────

/** POST /api/Subscription/subscribe */
export interface SubscribeRequest {
  planId: string;
  billingCycle: SubscriptionBillingCycle;
}

/** POST /api/Subscription/plans (Admin) */
export interface CreateSubscriptionPlanRequest {
  name: string;
  description?: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  maxProducts: number;
  canBoostProducts: boolean;
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  displayOrder?: number;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

/** Returned by GET /api/Subscription/plans */
export interface SubscriptionPlanResponse {
  id: string;
  name: string;
  description?: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  maxProducts: number;
  canBoostProducts: boolean;
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  displayOrder: number;
  isActive: boolean;
}

/** Returned by GET /api/Subscription/my */
export interface VendorSubscriptionResponse {
  id: string;
  vendorId: string;
  planId: string;
  planName: string;
  billingCycle: SubscriptionBillingCycle;
  priceAtPurchase: number;
  startDate: string; // ISO 8601
  expiryDate: string; // ISO 8601
  isActive: boolean;
  isCancelled: boolean;
}

/** Returned by GET /api/Subscription/my/history */
export interface SubscriptionHistoryItem {
  id: string;
  planName: string;
  billingCycle: SubscriptionBillingCycle;
  amount: number;
  status: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}
