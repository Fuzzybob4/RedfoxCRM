import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

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

const publicRoutes = ["/", "/login", "/signup", "/reset-password", "/auth/callback"]

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

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|image).*)"],
}
