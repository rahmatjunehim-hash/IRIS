import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ROLE_ALLOWED_ROUTES, ROLE_DEFAULT_ROUTES } from "./lib/constants";
import { SessionUser, SESSION_COOKIE_NAME } from "./lib/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "iris-secret-key-optik-i-see-you-for-every-you-2026"
);

// Public routes that don't require session cookie
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/registrasi",
  "/display",
  "/api/auth",
  "/api/orders",
  "/api/display",
  "/api/notifications",
  "/api/stock",
  "/api/users",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files, Next.js internals, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // All /api/* routes handle their own JSON responses and should never be redirected to HTML login page
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check if current route is a public page
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)));

  // Extract session token
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  let user: SessionUser | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload as unknown as SessionUser;
    } catch {
      user = null;
    }
  }

  // Handle root "/" (Landing page) -> Always show landing page to anyone
  if (pathname === "/") {
    return NextResponse.next();
  }

  // If user is already logged in and accesses /login, redirect to their role dashboard
  if (pathname === "/login" && user) {
    const targetRoute = ROLE_DEFAULT_ROUTES[user.role] || "/admin";
    return NextResponse.redirect(new URL(targetRoute, req.url));
  }

  // If route is public, allow access
  if (isPublic) {
    return NextResponse.next();
  }

  // Protected route: check authentication
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Super Admin can access all dashboards
  if (user.role === "SUPER_ADMIN") {
    return NextResponse.next();
  }

  // Role-based Access Control (RBAC)
  const role = user.role;
  const allowedRoutes = ROLE_ALLOWED_ROUTES[role] || [];
  const isAllowed = allowedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  // In development, if a logged-in staff opens another dashboard tab for parallel testing, allow access or fallback
  if (!isAllowed) {
    if (process.env.NODE_ENV !== "production") {
      // Allow testing across tabs in local development
      return NextResponse.next();
    }
    const defaultRoute = ROLE_DEFAULT_ROUTES[role] || "/login";
    return NextResponse.redirect(new URL(defaultRoute, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
