import { NextRequest, NextResponse } from "next/server"

// Protected route paths requiring authentication
const PROTECTED_ROUTES = ["/dashboard", "/admin", "/api/admin", "/api/transactions"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path matches any protected route
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  // If route is not protected, allow access
  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for session cookie from Better Auth
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value

  // No session token cookie → redirect to login
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/transactions/:path*",
  ],
}
