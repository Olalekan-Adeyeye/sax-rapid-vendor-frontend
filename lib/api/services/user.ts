/**
 * User API Service
 * Handles fetching, updating and account management for users.
 * DERIVED FROM the Sax Rapid Marketplace OpenAPI spec v1
 */

import { apiClient } from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
	UserProfileResponse,
	UpdateProfileRequest,
} from "../types/user.types";

const BASE = "/Users";

/**
 * Get current authenticated user profile
 * @returns UserProfileResponse
 */
export const getUserProfile = async (): Promise<UserProfileResponse> => {
	const { data } = await apiClient.get<ApiResponse<UserProfileResponse>>(`${BASE}/profile`);
	return data.data;
};

/**
 * Update authenticated user profile
 * @param data UpdateProfileRequest
 * @returns Promise<void>
 */
export const updateUserProfile = async (
	data: UpdateProfileRequest,
): Promise<void> => {
	await apiClient.put(`${BASE}/profile`, data);
};

/**
 * Request account deletion (soft delete)
 * @returns Promise<void>
 */
export const deleteAccount = async (): Promise<void> => {
	await apiClient.delete(`${BASE}/account`);
};
