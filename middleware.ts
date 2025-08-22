import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname

  // Check for session cookie instead of using Supabase auth helpers
  const sessionCookie = req.cookies.get("sb-access-token")?.value
  const hasSession = !!sessionCookie

  const isAuthPage = path === "/login" || path === "/signup" || path.startsWith("/auth/callback")

  const protectedPrefixes = [
    "/dashboard",
    "/customers",
    "/invoices",
    "/estimates",
    "/projects",
    "/reports",
    "/profile",
    "/mapping",
    "/scheduling",
    "/products",
    "/sales",
  ]

  // Redirect to login if accessing protected route without session
  if (protectedPrefixes.some((p) => path.startsWith(p)) && !hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectedFrom", path)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing auth pages with session
  if (hasSession && isAuthPage && !path.startsWith("/auth/callback")) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    url.searchParams.delete("redirectedFrom")
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/auth/callback",
    "/dashboard/:path*",
    "/customers/:path*",
    "/invoices/:path*",
    "/estimates/:path*",
    "/projects/:path*",
    "/reports/:path*",
    "/profile/:path*",
    "/mapping/:path*",
    "/scheduling/:path*",
    "/products/:path*",
    "/sales/:path*",
  ],
}
