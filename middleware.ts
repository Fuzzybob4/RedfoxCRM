import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  // return the SAME res so cookie writes persist
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

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

  if (protectedPrefixes.some((p) => path.startsWith(p)) && !session) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectedFrom", path) // e.g. /dashboard
    return NextResponse.redirect(url)
  }

  if (session && isAuthPage && !path.startsWith("/auth/callback")) {
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
