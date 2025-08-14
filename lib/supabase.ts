import { createClient } from "@supabase/supabase-js"
import type { CookieOptions } from "@supabase/auth-helpers-shared"

// Validate required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "sb-session",
    storage: {
      getItem: (key) => {
        try {
          if (typeof window === "undefined") return null
          const value = window.localStorage.getItem(key)
          console.debug("Auth storage - getItem:", {
            key,
            hasValue: !!value,
            timestamp: new Date().toISOString(),
          })
          return value
        } catch (error) {
          console.error("Failed to get item from storage:", error)
          return null
        }
      },
      setItem: (key, value) => {
        try {
          if (typeof window === "undefined") return
          window.localStorage.setItem(key, value)
          console.debug("Auth storage - setItem:", {
            key,
            hasValue: !!value,
            timestamp: new Date().toISOString(),
          })
        } catch (error) {
          console.error("Failed to set item in storage:", error)
        }
      },
      removeItem: (key) => {
        try {
          if (typeof window === "undefined") return
          window.localStorage.removeItem(key)
          console.debug("Auth storage - removeItem:", {
            key,
            timestamp: new Date().toISOString(),
          })
        } catch (error) {
          console.error("Failed to remove item from storage:", error)
        }
      },
    },
    cookieOptions,
    debug: true,
  },
  persistSession: true,
  autoRefreshToken: true,
})

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

