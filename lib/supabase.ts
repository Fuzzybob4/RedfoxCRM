import { createClient } from "@supabase/supabase-js"
import type { CookieOptions } from "@supabase/auth-helpers-shared"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Safe cookie options with fallbacks
const cookieOptions: CookieOptions = {
  name: "sb-session",
  lifetime: 7 * 24 * 60 * 60, // 7 days
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
}

// Only add domain if it's properly formatted
if (process.env.NEXT_PUBLIC_DOMAIN) {
  try {
    // Remove protocol and any trailing slash
    const domain = process.env.NEXT_PUBLIC_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "")
    if (domain) {
      cookieOptions.domain = domain
    }
  } catch (error) {
    console.error("Failed to parse domain for cookie options:", error)
  }
}

// Debug log the final configuration
console.debug("Supabase initialization:", {
  url: supabaseUrl,
  cookieOptions,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString(),
})

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Export createClient as a named export for compatibility
export { createClient }

// Enhanced session check with better error handling
export async function checkSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    console.debug("Session check:", {
      hasSession: !!session,
      sessionDetails: session
        ? {
            userId: session.user.id,
            expiresAt: new Date(session.expires_at! * 1000).toISOString(),
            provider: session.provider,
          }
        : null,
      error: error?.message,
      timestamp: new Date().toISOString(),
    })

    if (error) {
      console.error("Session check error:", {
        error,
        timestamp: new Date().toISOString(),
      })
      return null
    }

    return session
  } catch (error) {
    console.error("Unexpected session check error:", {
      error,
      timestamp: new Date().toISOString(),
    })
    return null
  }
}

// Enhanced session refresh with better error handling
export async function refreshSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession()

    console.debug("Session refresh attempt:", {
      hasSession: !!session,
      error: error?.message,
      timestamp: new Date().toISOString(),
    })

    if (error) {
      throw error
    }

    return session
  } catch (error) {
    console.error("Session refresh error:", {
      error,
      timestamp: new Date().toISOString(),
    })
    return null
  }
}
