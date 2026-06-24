import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight middleware — checks session cookie only, no Prisma import
// This avoids Edge Runtime incompatibility with Node.js modules
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for NextAuth session token cookie
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
