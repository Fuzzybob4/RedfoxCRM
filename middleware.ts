import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  try {
    // Create a response object that we can modify
    const res = NextResponse.next()

    // Only run auth logic for protected routes to avoid Edge Runtime issues
    const protectedRoutes = [
      "/dashboard",
      "/sales",
      "/customers",
      "/profile",
      "/invoices",
      "/estimates",
      "/projects",
      "/reports",
      "/staff",
      "/orders",
      "/mapping",
      "/service-trends",
      "/settings",
    ]

    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    if (!isProtectedRoute) {
      return res
    }

    // Create a Supabase client specific to this middleware request
    const supabase = createMiddlewareClient({ req, res })

    // Wrap session check in try-catch
    let session = null
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Session retrieval error:", error)
      } else {
        session = data.session
      }
    } catch (sessionError) {
      console.error("Failed to get session:", sessionError)
      // Continue without session
    }

    // If accessing a protected route without a session
    if (!session && isProtectedRoute) {
      // Store the attempted URL to redirect back after login
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)

      const response = NextResponse.redirect(redirectUrl)

      // Set redirect cookie with fallback options
      try {
        response.cookies.set("redirectTo", req.nextUrl.pathname, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 5, // 5 minutes
          path: "/",
        })
      } catch (cookieError) {
        console.error("Failed to set redirect cookie:", cookieError)
      }

      return response
    }

    return res
  } catch (error) {
    // Log the complete error
    console.error("Middleware critical error:", error)

    // For critical errors, return a basic response to prevent the 500 error
    return NextResponse.next()
  }
}

// Configure which routes use this middleware - be more specific to avoid Edge Runtime issues
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sales/:path*",
    "/customers/:path*",
    "/profile/:path*",
    "/invoices/:path*",
    "/estimates/:path*",
    "/projects/:path*",
    "/reports/:path*",
    "/staff/:path*",
    "/orders/:path*",
    "/mapping/:path*",
    "/service-trends/:path*",
    "/settings/:path*",
  ],
}
