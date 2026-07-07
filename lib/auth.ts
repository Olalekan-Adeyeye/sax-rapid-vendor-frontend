import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { UserProfile, ApiResponse } from "@/lib/api/types/auth.types";
import type { VendorProfileResponse } from "@/lib/api/types/vendor.types";
import { mapUserToProfile, type UserProfileResponse } from "@/lib/api/types/user.types";
import { BASE_URL } from "@/lib/api/apiClient";

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  vendorProfile: VendorProfileResponse | null;
  isTwoFactorVerified: boolean;
}

const TOKEN_KEY = "sax_access_token";
const REFRESH_TOKEN_KEY = "sax_refresh_token";
const TFA_COOKIE_KEY = "sax_2fa";

export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value ?? null;
}

export async function getServerRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value ?? null;
}

export async function getServerTwoFactorVerified(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(TFA_COOKIE_KEY)?.value === "true";
}

export async function getCurrentUser(
  token: string,
): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}/Users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    if (!response.ok) return null;
    const json: ApiResponse<unknown> = await response.json();
    if (!json.success || !json.data) return null;
    return mapUserToProfile(json.data as UserProfileResponse);
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

export async function getServerSession(): Promise<AuthSession> {
  const token = await getServerToken();
  if (!token) {
    return { user: null, token: null, vendorProfile: null, isTwoFactorVerified: false };
  }

  const [user, vendorProfile, isTwoFactorVerified] = await Promise.all([
    getCurrentUser(token),
    getServerVendor(token),
    getServerTwoFactorVerified(),
  ]);

  return {
    user,
    token,
    vendorProfile,
    isTwoFactorVerified,
  };
}

export function requireAuth(): never {
  redirect("/login");
}

export function requireOnboarding(): never {
  redirect("/onboarding");
}
