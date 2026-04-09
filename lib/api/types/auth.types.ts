/**
 * TypeScript types/DTOs for the Authentication tag
 * Derived from the Sax Rapid Marketplace OpenAPI spec v1
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole =
  | "Buyer"
  | "Seller"
  | "Vendor"
  | "Admin"
  | "SuperAdmin"
  | "Moderator"
  | "Support";

export type UserStatus = "Active" | "Suspended" | "Deactivated" | "Pending";

export type VerificationStatus =
  | "NotVerified"
  | "Pending"
  | "Verified"
  | "Rejected";

// ─── Request DTOs ─────────────────────────────────────────────────────────────

/** POST /api/Auth/register */
export interface RegisterRequest {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  /** ISO country code e.g. "NG", "ZA" */
  countryCode?: string | null;
  phoneNumber?: string | null;
  password?: string | null;
  role?: UserRole | null;
}

/** POST /api/Auth/login */
export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}

/** POST /api/Auth/verify-otp */
export interface VerifyOtpRequest {
  email?: string | null;
  otpCode?: string | null;
}

/** POST /api/Auth/refresh-token */
export interface RefreshTokenRequest {
  refreshToken?: string | null;
}

/** POST /api/Auth/forgot-password */
export interface ForgotPasswordRequest {
  email?: string | null;
}

/** POST /api/Auth/reset-password */
export interface ResetPasswordRequest {
  /** Required – user email */
  email: string;
  /** Required – OTP received via email */
  otp: string;
  /** Required – minimum 6 characters */
  newPassword: string;
}

/** POST /api/Auth/change-password (authenticated) */
export interface ChangePasswordRequest {
  /** Required */
  oldPassword: string;
  /** Required – minimum 6 characters */
  newPassword: string;
}

/** POST /api/Auth/resend-otp */
export interface ResendOtpRequest {
  email?: string | null;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

/** Returned by register, login, verify-otp, refresh-token */
export interface AuthResponse {
  userId: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  /** Bearer access token */
  token?: string | null;
  refreshToken?: string | null;
  tokenExpiresAt: string; // ISO 8601 date-time
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
}

// ─── Error shape ──────────────────────────────────────────────────────────────

export interface ApiErrorDetails {
  code?: string | null;
  details?: string[] | null;
  stackTrace?: string | null;
}

export interface ApiError {
  success: boolean;
  message?: string | null;
  error?: ApiErrorDetails;
}
// ─── Global Response Wrapper ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Shared Models ────────────────────────────────────────────────────────────

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  countryCode?: string;
  avatarUrl?: string;
}

/**
 * Maps an API AuthResponse to the internal UserProfile state.
 * Useful for consistent conversion between standard API shapes and UI state.
 */
export function mapAuthToProfile(authData: AuthResponse): UserProfile {
  return {
    userId: authData.userId,
    email: authData.email || "",
    firstName: authData.firstName || "",
    lastName: authData.lastName || "",
    phoneNumber: authData.phoneNumber || "",
    role: authData.role,
    isVerified: authData.isVerified,
    isTwoFactorEnabled: authData.isTwoFactorEnabled,
  };
}
