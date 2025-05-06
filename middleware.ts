import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get('admin')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // If trying to access admin routes without being logged in
  if (isAdminRoute && !adminCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and trying to access login page
  if (isLoginPage && adminCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  const response = NextResponse.next()
  
  // Add a header to indicate if this is an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('x-is-admin-route', 'true')
  }
  
  return response
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: ['/login', '/admin/:path*']
}
