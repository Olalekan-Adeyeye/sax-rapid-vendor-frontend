import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware (root/proxy.ts)
 * Handles server-side redirections based on authentication cookies.
 */
export default function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("sax_access_token")?.value;

	const PUBLIC_ROUTES = [
		"/",
		"/login",
		"/signup",
		"/forgot-password",
		"/reset-password",
		"/verify",
		"/2fa",
		"/onboarding",
	];
	const isPublicRoute = PUBLIC_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(route + "/"),
	);

	// 1. If trying to access a protected route without a token
	if (!token && !isPublicRoute) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
// Optimize performance by excluding static assets and common patterns
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - assets (public assets)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
	],
};
