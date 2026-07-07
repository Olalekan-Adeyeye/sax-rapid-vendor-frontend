import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "sax_access_token";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/2fa",
  "/onboarding",
  "/faq",
  "/resources",
];

function isPublicOrAuthRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
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
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
