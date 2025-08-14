import { createClient } from "@supabase/supabase-js"
import type { CookieOptions } from "@supabase/auth-helpers-shared"

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing required Supabase environment variables")
}

// Safe cookie options with fallbacks
const cookieOptions: CookieOptions = {
  name: "sb-session",
  lifetime: 7 * 24 * 60 * 60, // 7 days
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
}

// Only add domain if it's properly formatted and we're in browser
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_DOMAIN) {
  try {
    // Remove protocol and any trailing slash
    const domain = process.env.NEXT_PUBLIC_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "")
    if (domain && domain !== "localhost") {
      cookieOptions.domain = domain
    }
  } catch (error) {
    console.error("Failed to parse domain for cookie options:", error)
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "sb-session",
    storage:
      typeof window !== "undefined"
        ? {
            getItem: (key) => {
              try {
                const value = window.localStorage.getItem(key)
                return value
              } catch (error) {
                console.error("Failed to get item from storage:", error)
                return null
              }
            },
            setItem: (key, value) => {
              try {
                window.localStorage.setItem(key, value)
              } catch (error) {
                console.error("Failed to set item in storage:", error)
              }
            },
            removeItem: (key) => {
              try {
                window.localStorage.removeItem(key)
              } catch (error) {
                console.error("Failed to remove item from storage:", error)
              }
            },
          }
        : undefined,
    cookieOptions,
  },
})

// Enhanced session check with better error handling
export async function checkSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Session check error:", error)
      return null
    }

    return session
  } catch (error) {
    console.error("Unexpected session check error:", error)
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

    if (error) {
      throw error
    }

    return session
  } catch (error) {
    console.error("Session refresh error:", error)
    return null
  }
}
