import axios from "axios";

import { getMyVendorProfile } from "../api/services/vendor";

export interface PostAuthFlags {
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
}

export async function resolvePostAuthDestination(
  flags: PostAuthFlags,
): Promise<string> {
  if (!flags.isVerified) return "/verify";
  if (flags.isTwoFactorEnabled) return "/2fa";
  try {
    const vendor = await getMyVendorProfile();
    return vendor ? "/dashboard" : "/onboarding";
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return "/onboarding";
    }
    return "/dashboard";
  }
}

export function setPendingVerifyCookie(email: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `sax_pending_verify=${encodeURIComponent(email)}; path=/; max-age=600; SameSite=Lax`;
}
