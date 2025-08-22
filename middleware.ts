import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Helper to check test auth from cookies
function getTestAuthFromCookies(req: NextRequest) {
  const testAuthCookie = req.cookies.get("test-auth-session")?.value
  if (testAuthCookie) {
    try {
      const decoded = decodeURIComponent(testAuthCookie)
      const parsed = JSON.parse(decoded)
      if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
        console.log("Valid test session found in middleware for:", parsed.email)
        return { id: parsed.userId, email: parsed.email }
      } else {
        console.log("Test session expired in middleware")
      }
    } catch (e) {
      console.error("Error parsing test auth cookie:", e)
    }
  }
  return null
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/customers",
    "/invoices",
    "/projects",
    "/estimates",
    "/settings",
    "/sales",
    "/mapping",
    "/scheduling",
    "/products",
    "/reports",
    "/profile",
  ]

  // Admin routes
  const adminRoutes = ["/admin"]

  const { pathname } = req.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Handle admin routes separately (they have their own auth system)
  if (isAdminRoute && pathname !== "/admin/login") {
    return res
  }

  if (isProtectedRoute) {
    // First check for test auth
    const testUser = getTestAuthFromCookies(req)
    if (testUser) {
      console.log("Test auth found for user:", testUser.email)
      return res
    }

    // Then check Supabase auth
    try {
      const supabase = createMiddlewareClient({ req, res })
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        console.log("Supabase auth found for user:", session.user.email)
        return res
      }
    } catch (error) {
      console.error("Middleware Supabase auth error:", error)
    }

    // No valid auth found, redirect to login
    console.log("No valid auth found, redirecting to login")
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
