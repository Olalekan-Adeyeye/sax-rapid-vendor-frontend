import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { BASE_URL } from "@/lib/api/apiClient";
import type { UserProfile, ApiResponse } from "@/lib/api/types/auth.types";
import { mapUserToProfile, type UserProfileResponse } from "@/lib/api/types/user.types";
import type { VendorProfileResponse } from "@/lib/api/types/vendor.types";
import {
  TWO_FACTOR_MAX_AGE_SEC,
  isTwoFactorFlagValid,
} from "@/lib/utils/twoFactorFlag";

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  vendorProfile: VendorProfileResponse | null;
  isTwoFactorVerified: boolean;
}

const TOKEN_KEY = "sax_access_token";
const REFRESH_TOKEN_KEY = "sax_refresh_token";
const TFA_COOKIE_KEY = "sax_2fa";
export const TWO_FACTOR_MAX_AGE_SECONDS = TWO_FACTOR_MAX_AGE_SEC;

export const ALLOWED_VENDOR_ROLES = ["Vendor", "Seller"] as const;

export function isVendorRole(role: string | null | undefined): boolean {
  return (
    role === ALLOWED_VENDOR_ROLES[0] || role === ALLOWED_VENDOR_ROLES[1]
  );
}

export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value ?? null;
}

export async function getServerRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value ?? null;
}

export async function getServerTwoFactorVerified(
  token: string | null,
): Promise<boolean> {
  if (!token) return false;
  const cookieStore = await cookies();
  const flag = cookieStore.get(TFA_COOKIE_KEY)?.value;
  return isTwoFactorFlagValid(flag, token);
}

export async function getCurrentUser(
  token: string,
): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}/Users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    if (response.ok) {
      const json: ApiResponse<unknown> = await response.json();
      if (json.success && json.data) {
        return mapUserToProfile(json.data as UserProfileResponse);
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function getServerVendor(
  token: string,
): Promise<VendorProfileResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/Vendor/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    if (response.status === 404) return null;
    if (!response.ok) return null;
    const json: ApiResponse<VendorProfileResponse> = await response.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export const getServerSession = cache(async (): Promise<AuthSession> => {
  const token = await getServerToken();
  if (!token) {
    return { user: null, token: null, vendorProfile: null, isTwoFactorVerified: false };
  }

  const [user, vendorProfile, isTwoFactorVerified] = await Promise.all([
    getCurrentUser(token),
    getServerVendor(token),
    getServerTwoFactorVerified(token),
  ]);

  return {
    user,
    token,
    vendorProfile,
    isTwoFactorVerified,
  };
});

export function shouldRedirectToDashboard(session: AuthSession): boolean {
  return !!(
    session.token &&
    session.user &&
    isVendorRole(session.user.role) &&
    session.user.isVerified &&
    session.vendorProfile !== null &&
    session.vendorProfile.verificationStatus === "Verified" &&
    (!session.user.isTwoFactorEnabled || session.isTwoFactorVerified)
  );
}

export function requireAuth(): never {
  redirect("/login");
}

export function requireOnboarding(): never {
  redirect("/onboarding");
}
