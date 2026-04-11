/**
 * Subscription Services
 * All endpoints under the "Subscriptions" tag — /api/Subscription/*
 */

import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
	SubscriptionPlanResponse,
	SubscribeRequest,
	VendorSubscriptionResponse,
	SubscriptionHistoryItem,
} from "../types/subscriptions.types";

const BASE = "/Subscription";

/**
 * GET /api/Subscription/plans
 * Returns all available vendor subscription plans.
 */
export async function getSubscriptionPlans(
	activeOnly = true,
): Promise<SubscriptionPlanResponse[]> {
	const response = await apiClient.get<ApiResponse<SubscriptionPlanResponse[]>>(
		`${BASE}/plans`,
		{
			params: { activeOnly },
		},
	);
	return response.data.data;
}

/**
 * GET /api/Subscription/plans/{planId}
 * Returns the details of a specific subscription plan.
 */
export async function getSubscriptionPlanById(
	planId: string,
): Promise<SubscriptionPlanResponse> {
	const response = await apiClient.get<ApiResponse<SubscriptionPlanResponse>>(
		`${BASE}/plans/${planId}`,
	);
	return response.data.data;
}

/**
 * POST /api/Subscription/subscribe
 * Subscribes the authenticated vendor to a subscription plan.
 */
export async function subscribeToPlan(data: SubscribeRequest): Promise<void> {
	await apiClient.post(`${BASE}/subscribe`, data);
}

/**
 * GET /api/Subscription/my
 * Returns the current active subscription for the authenticated vendor.
 */
export async function getMySubscription(): Promise<VendorSubscriptionResponse | null> {
	const response = await apiClient.get<ApiResponse<VendorSubscriptionResponse>>(
		`${BASE}/my`,
	);
	return response.data.data;
}

/**
 * DELETE /api/Subscription/my
 * Cancels the authenticated vendor's current subscription.
 */
export async function cancelSubscription(): Promise<void> {
	await apiClient.delete(`${BASE}/my`);
}

/**
 * GET /api/Subscription/my/history
 * Returns a full history of all subscription periods for the authenticated vendor.
 */
export async function getSubscriptionHistory(): Promise<
	SubscriptionHistoryItem[]
> {
	const response = await apiClient.get<ApiResponse<SubscriptionHistoryItem[]>>(
		`${BASE}/my/history`,
	);
	return response.data.data;
}
