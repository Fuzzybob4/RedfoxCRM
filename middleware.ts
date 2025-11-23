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
        return { id: parsed.userId, email: parsed.email }
      }
    } catch (e) {
      console.error("[v0] Error parsing test auth cookie:", e)
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

  if (pathname === "/signup" || pathname === "/login") {
    return res
  }

  if (isProtectedRoute) {
    // Check for test auth
    const testUser = getTestAuthFromCookies(req)
    if (testUser) {
      return res
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      try {
        const { createMiddlewareClient } = await import("@supabase/auth-helpers-nextjs")
        const supabase = createMiddlewareClient({ req, res })
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          return res
        }
      } catch (error) {
        console.error("[v0] Middleware Supabase auth error:", error)
      }
    }

    // No valid auth found, redirect to login
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
