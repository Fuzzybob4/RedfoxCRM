import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  console.log("Middleware running for path:", req.nextUrl.pathname)

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("Session in middleware:", !!session)

  // If no session, redirect to login
  if (!session) {
    console.log("Redirecting to login from middleware")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sales/:path*",
    "/customers/:path*",
    "/profile/:path*",
    "/invoices/:path*",
    "/estimates/:path*",
    "/projects/:path*",
  ],
}

