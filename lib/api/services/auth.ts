/**
 * Authentication Services
 * All endpoints under the "Authentication" tag — /api/Auth/*
 */

import apiClient from "../apiClient";
import type {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ResendOtpRequest,
  AuthResponse,
  ApiResponse,
  TwoFactorResponse,
  Verify2faRequest,
  Disable2faRequest,
} from "../types/auth.types";

const BASE = "/Auth";

/**
 * POST /api/Auth/register
 * Creates a new user account and returns auth tokens.
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(`${BASE}/register`, data);
  return response.data.data;
}

/**
 * POST /api/Auth/login
 * Authenticates with email and password. Returns access + refresh tokens.
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(`${BASE}/login`, data);
  return response.data.data;
}

/**
 * POST /api/Auth/verify-otp
 * Verifies the OTP sent to the user's email to complete account verification.
 */
export async function verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(`${BASE}/verify-otp`, data);
  return response.data.data;
}

/**
 * POST /api/Auth/refresh-token
 * Exchanges a valid refresh token for a new access token.
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(`${BASE}/refresh-token`, data);
  return response.data.data;
}

/**
 * POST /api/Auth/forgot-password
 * Sends a password-reset OTP to the user's email. Unauthenticated.
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await apiClient.post(`${BASE}/forgot-password`, data);
}

/**
 * POST /api/Auth/reset-password
 * Resets the password using an OTP from email. Unauthenticated.
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await apiClient.post(`${BASE}/reset-password`, data);
}

/**
 * POST /api/Auth/change-password
 * Changes the password for a logged-in user using their old password.
 * Requires a valid Bearer token.
 */
export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await apiClient.post(`${BASE}/change-password`, data);
}

/**
 * POST /api/Auth/resend-otp
 * Resends the OTP to the user's registered email address.
 */
export async function resendOtp(data: ResendOtpRequest): Promise<void> {
  await apiClient.post(`${BASE}/resend-otp`, data);
}

/**
 * Logout — clears stored tokens locally.
 * Note: Actual token clearing should be handled by the caller.
 */
export function logout(): void {
	// Pure function, side effects moved to components/pages
}

/**
 * POST /api/Auth/2fa/setup
 * Generates a TOTP secret and QR code URI for the current user.
 */
export async function setupTwoFactor(): Promise<TwoFactorResponse> {
	const response = await apiClient.post<ApiResponse<TwoFactorResponse>>(`${BASE}/2fa/setup`);
	return response.data.data;
}

/**
 * POST /api/Auth/2fa/verify
 * Verifies the TOTP code and enables 2FA.
 */
export async function verifyTwoFactor(data: Verify2faRequest): Promise<void> {
	await apiClient.post(`${BASE}/2fa/verify`, data);
}

/**
 * POST /api/Auth/2fa/disable
 * Disables 2FA for the current user.
 */
export async function disableTwoFactor(data: Disable2faRequest): Promise<void> {
	await apiClient.post(`${BASE}/2fa/disable`, data);
}
