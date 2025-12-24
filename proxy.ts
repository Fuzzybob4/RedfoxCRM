import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { createClient } from "@supabase/supabase-js"

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
  "/company-resources",
  "/contacts",
]

const publicRoutes = ["/", "/login", "/signup", "/reset-password", "/auth/callback", "/pricing", "/trial-expired"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth check for public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/auth/"))) {
    return NextResponse.next()
  }

  // Check if protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Update session and check auth
  const { user, response } = await updateSession(request)

  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Get user's organization
      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (membership?.org_id) {
        // Check subscription status
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("status, trial_end")
          .eq("org_id", membership.org_id)
          .maybeSingle()

        if (subscription) {
          const now = new Date()
          const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null

          // If trial status and trial has expired, or if status is not active/trial
          const isTrialExpired = subscription.status === "trial" && trialEnd && now > trialEnd
          const isInactive = !["active", "trial"].includes(subscription.status)

          if (isTrialExpired || isInactive) {
            // Don't redirect if already on trial-expired page
            if (pathname !== "/trial-expired") {
              const redirectUrl = request.nextUrl.clone()
              redirectUrl.pathname = "/trial-expired"
              return NextResponse.redirect(redirectUrl)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("[v0] Error checking subscription status:", error)
    // Allow access if subscription check fails to avoid blocking users
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|image).*)"],
}
