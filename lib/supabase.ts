import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Enhanced getCurrentUser function with better error handling
export async function getCurrentUser() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Session error:", error)
      return { user: null, error }
    }

    return { user: session?.user ?? null, error: null }
  } catch (error) {
    console.error("GetUser error:", error)
    return { user: null, error: error as Error }
  }
}

// Enhanced signIn function
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error("SignIn error:", error)
    return {
      data: null,
      error: { message: "Network error. Please check your connection and try again." },
    }
  }
}

// Enhanced signUp function
export async function signUp(email: string, password: string, fullName?: string) {
  try {
    console.log("Attempting to sign up with email:", email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.error("SignUp error:", error)
      return { data: null, error }
    }

    console.log("Sign up successful for:", data.user?.email)
    return { data, error: null }
  } catch (err) {
    console.error("SignUp catch error:", err)
    return {
      data: null,
      error: {
        message: "Network error. Please check your connection and try again.",
        name: "NetworkError",
      },
    }
  }
}

// Google OAuth sign in function - FIXED: Added missing export
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    return { data, error }
  } catch (error) {
    console.error("Google SignIn error:", error)
    return {
      data: null,
      error: { message: "Failed to connect to Google. Please try again." },
    }
  }
}

// Enhanced signOut function
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error("SignOut error:", error)
    return { error: { message: "Failed to sign out. Please try again." } }
  }
}

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("profiles").select("count").limit(1)
    return { connected: !error, error }
  } catch (err) {
    console.error("Connection test error:", err)
    return { connected: false, error: err }
  }
}

// Reset password function
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Reset password error:", error)
    return { error }
  }
}
