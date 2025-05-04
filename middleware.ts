import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login"

  // Check if the path is for admin routes
  const isAdminPath = path.startsWith("/admin")

  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value

  // Redirect logic
  if (isAdminPath && !token) {
    // Redirect to login if trying to access admin without token
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isPublicPath && token) {
    // Redirect to admin dashboard if already logged in
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: ["/admin/:path*", "/login"],
}
