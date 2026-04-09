"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
// import Loading from "@/app/loading";

interface AuthGuardProps {
	children: React.ReactNode;
}

const PUBLIC_PAGES = [
	"/login",
	"/signup",
	"/forgot-password",
	"/reset-password",
];
const AUTH_FLOW_PAGES = ["/verify", "/2fa", "/onboarding"];

/**
 * Global Route Guard
 * Enforces dynamic redirection based on user status (verified, 2fa, etc.)
 */
export function AuthGuard({ children }: AuthGuardProps) {
	const { user, loading, isTwoFactorVerified } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (loading) return;

		// 1. Unauthenticated -> Redirect to login if on protected/auth route
		if (!user) {
			if (!PUBLIC_PAGES.includes(pathname)) {
				router.replace("/login");
			}
			return;
		}

		// 2. Role Security -> Only Sellers (Vendors) allowed. Buyers/others go to onboarding
		// (Assuming onboarding converts Buyer to Seller)

		// 3. Status Check: Verification
		// Have to disable for now (Still in testing phase)
		/*
		if (!user.isVerified) {
			if (pathname !== "/verify") {
				router.replace("/verify");
			}
			return;
		}
		*/

		// 4. Status Check: Two Factor
		// Have to disable for now (Still in testing phase)
		/*
		if (user.isTwoFactorEnabled && !isTwoFactorVerified) {
			if (pathname !== "/2fa") {
				router.replace("/2fa");
			}
			return;
		}
		*/

		// LAX_FOR_TESTING: Disabled to allow viewing changes
		/*
		// 5. Status Check: Onboarding (Vendor/Seller role is the completion flag)
		const isMerchant = user.role === "Vendor" || user.role === "Seller";
		if (!isMerchant) {
			if (pathname !== "/onboarding") {
				router.replace("/onboarding");
			}
			return;
		}
		*/

		// 6. Already authenticated & authorized -> redirect away from auth pages
		// LAX_FOR_TESTING: Disabled to allow viewing changes
		/*
		if (
			PUBLIC_PAGES.includes(pathname) ||
			AUTH_FLOW_PAGES.includes(pathname) ||
			pathname === "/"
		) {
			router.replace("/dashboard");
		}
		*/
	}, [user, loading, isTwoFactorVerified, pathname, router]);

	// ─── FLASH PREVENTION ──────────────────────────────────────────────
	// Determine if we should render children or null based on current state vs route

	if (loading) return null; // Or a global spinner

	if (!user) {
		return PUBLIC_PAGES.includes(pathname) ? <>{children}</> : null;
	}

	// Have to disable for now (Still in testing phase)
	/*
	if (!user.isVerified) {
		return pathname === "/verify" ? <>{children}</> : null;
	}

	if (user.isTwoFactorEnabled && !isTwoFactorVerified) {
		return pathname === "/2fa" ? <>{children}</> : null;
	}
	*/

	// For fully ready sellers, block auth pages
	// LAX_FOR_TESTING: Disabled to allow viewing changes
	/*
	// For users who are NOT yet vendors/sellers, only allow onboarding
	const isMerchant = user.role === "Vendor" || user.role === "Seller";
	if (!isMerchant) {
		return pathname === "/onboarding" ? <>{children}</> : null;
	}
	*/

	// For fully ready sellers, block auth pages
	// LAX_FOR_TESTING: Disabled to allow viewing changes
	/*
	// For fully ready merchants, block auth pages
	if (
		PUBLIC_PAGES.includes(pathname) ||
		AUTH_FLOW_PAGES.includes(pathname) ||
		pathname === "/"
	) {
		return null;
	}
	*/

	return <>{children}</>;
}
