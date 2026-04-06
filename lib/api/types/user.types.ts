/**
 * User related type definitions
 * Derived from the Sax Rapid Marketplace OpenAPI spec v1
 */

/**
 * User Roles within the platform
 */
export enum UserRole {
  Buyer = "Buyer",
  Seller = "Seller",
  Vendor = "Vendor",
  Admin = "Admin",
  SuperAdmin = "SuperAdmin",
  Moderator = "Moderator",
  Support = "Support",
}

/**
 * User Account Status
 */
export enum UserStatus {
  Active = "Active",
  Suspended = "Suspended",
  Deactivated = "Deactivated",
  Pending = "Pending",
}

/**
 * KYC/Email Verification Status
 */
export enum VerificationStatus {
  NotVerified = "NotVerified",
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
}

/**
 * Actions that can be performed on a user (Admin)
 */
export enum UserAction {
  Suspend = "Suspend",
  Activate = "Activate",
  ResetPassword = "ResetPassword",
  Delete = "Delete",
}

/**
 * User Profile Response Schema
 */
export interface UserProfileResponse {
  id: string; // uuid
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  role: UserRole;
  status: UserStatus;
  verificationStatus: VerificationStatus;
  profileImageUrl: string | null;
  isTwoFactorEnabled: boolean;
  createdAt: string; // date-time
  updatedAt: string | null; // date-time
}
/**
 * Request schema for updating user profile
 */
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  profileImageUrl?: string | null;
}

import type { UserProfile } from "./auth.types";

/**
 * Maps UserProfileResponse to the shared UserProfile state
 */
export function mapUserToProfile(profileData: UserProfileResponse): UserProfile {
  return {
    userId: profileData.id,
    email: profileData.email || "",
    firstName: profileData.firstName || "",
    lastName: profileData.lastName || "",
    phoneNumber: profileData.phoneNumber || "",
    role: profileData.role,
    isVerified: profileData.verificationStatus === "Verified",
    isTwoFactorEnabled: profileData.isTwoFactorEnabled,
    avatarUrl: profileData.profileImageUrl || undefined,
  };
}
