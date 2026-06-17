"use client";

import React, { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import { useAuth } from "@/lib/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_PAGES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/faq",
  "/resources",
];
const AUTH_FLOW_PAGES = ["/verify", "/2fa", "/onboarding"];

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, isTwoFactorVerified, vendorProfile, vendorLoading } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ─── 1. Resolve Target Route ──────────────────────────────────────────────
  const targetRoute = useMemo(() => {
    // While loading, we don't have enough state to make a decision
    if (loading || vendorLoading) return null;

    const isPublic = PUBLIC_PAGES.includes(pathname);
    const isAuthFlow = AUTH_FLOW_PAGES.includes(pathname);

    // 1. Calculate if the user is 100% ready for the dashboard
    const isFullyReady =
      !!user &&
      user.isVerified &&
      (!user.isTwoFactorEnabled || isTwoFactorVerified) &&
      !!vendorProfile;

    // 2. Fully ready users: Redirect AWAY from public/auth pages to dashboard
    if (isFullyReady) {
      if (isPublic || isAuthFlow || pathname === "/") {
        return "/dashboard";
      }
      return pathname;
    }

    // 3. Partially ready users: Allow staying on public pages
    if (isPublic) return pathname;

    // 4. Partially ready users on protected routes: Enforce the Auth Flow
    if (!user) return "/login";
    if (!user.isVerified) return "/verify"; //LAX for development purpose
    if (user.isTwoFactorEnabled && !isTwoFactorVerified) return "/2fa";
    if (vendorProfile === null) return "/onboarding";

    return pathname;
  }, [
    user,
    loading,
    isTwoFactorVerified,
    vendorProfile,
    vendorLoading,
    pathname,
  ]);

  // ─── 2. Handle Redirection ────────────────────────────────────────────────
  useEffect(() => {
    if (targetRoute && targetRoute !== pathname) {
      router.replace(targetRoute);
    }
  }, [targetRoute, pathname, router]);

  // ─── 3. Render Logic (Flash Prevention) ───────────────────────────────────
  // Show global loader if we are still fetching core auth state
  if (loading || vendorLoading) return <Loading />;

  // If a redirection is in progress, prevent rendering children to avoid flickering
  if (targetRoute && targetRoute !== pathname) return <Loading />;

  // Render children only if the user is on the correct route
  return <>{children}</>;
}
