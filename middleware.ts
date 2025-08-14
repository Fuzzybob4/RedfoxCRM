import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  try {
    // Create a response object that we can modify
    const res = NextResponse.next()

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

    // Protected routes that require authentication
    const protectedRoutes = ["/dashboard", "/sales", "/customers", "/profile", "/invoices", "/estimates", "/projects"]
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

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

    // If we have a session, try to refresh it
    if (session) {
      try {
        const {
          data: { session: refreshedSession },
          error: refreshError,
        } = await supabase.auth.refreshSession()

        if (refreshError) {
          console.error("Session refresh error:", refreshError)
        } else if (refreshedSession) {
          // Set cookies with error handling
          try {
            const cookieOptions = {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax" as const,
              path: "/",
            }

            res.cookies.set("sb-access-token", refreshedSession.access_token, {
              ...cookieOptions,
              maxAge: 60 * 60 * 24 * 7, // 1 week
            })

            if (refreshedSession.refresh_token) {
              res.cookies.set("sb-refresh-token", refreshedSession.refresh_token, {
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 30, // 30 days
              })
            }
          } catch (cookieError) {
            console.error("Failed to set auth cookies:", cookieError)
          }
        }
      } catch (refreshError) {
        console.error("Failed to refresh session:", refreshError)
        // Continue with the original session
      }
    }

    return res
  } catch (error) {
    // Log the complete error
    console.error("Middleware critical error:", error)

    // For critical errors, return a basic response to prevent the 500 error
    return NextResponse.next()
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
