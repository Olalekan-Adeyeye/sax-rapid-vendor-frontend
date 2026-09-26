import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "sax_access_token";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/verify",
  "/forgot-password",
  "/reset-password",
  "/faq",
  "/resources",
  "/seller-guide",
];

function isPublicOrAuthRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  const requestHeaders = new Headers(request.headers);

  if (token) {
    requestHeaders.set("x-auth-token", token);
  }

  requestHeaders.set(
    "x-auth-status",
    token ? "authenticated" : "unauthenticated",
  );

  if (!token && !isPublicOrAuthRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
