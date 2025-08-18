import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const protectedRoutes = [
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

    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // If accessing protected route without session, redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/login"
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If accessing auth pages while logged in, redirect to dashboard
    if (["/login", "/signup"].includes(req.nextUrl.pathname) && session) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return res
  }
}

export const config = {
  matcher: [
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
    "/login",
    "/signup",
  ],
}
