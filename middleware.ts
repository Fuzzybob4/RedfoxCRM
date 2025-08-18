import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Middleware session error:", error)
    }

    const path = req.nextUrl.pathname
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

    const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix))

    // If accessing protected route without session, redirect to login
    if (isProtectedRoute && !session) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirectedFrom", path)
      console.log("Redirecting to login from:", path)
      return NextResponse.redirect(url)
    }

    // If accessing auth pages while logged in, redirect to dashboard (except callback)
    if (session && isAuthPage && !path.startsWith("/auth/callback")) {
      const url = req.nextUrl.clone()
      url.pathname = "/dashboard"
      url.searchParams.delete("redirectedFrom")
      console.log("Redirecting to dashboard from:", path)
      return NextResponse.redirect(url)
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return res
  }
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
