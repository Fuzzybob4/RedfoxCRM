import { createClient } from "@supabase/supabase-js"

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing required Supabase environment variables")
}

// Create the main Supabase client with your specified configuration
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
                return window.localStorage.getItem(key)
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
  },
  // Disable realtime for Edge Runtime compatibility
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
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
