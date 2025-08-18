import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClientComponentClient<Database>()

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

// Enhanced signIn function with timeout
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
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

// Google OAuth sign in function
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    },
  })
}

// Enhanced signOut function
export async function signOut() {
  return await supabase.auth.signOut()
}

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("profiles").select("count").limit(1)
    return { connected: !error, error }
  } catch (err) {
    return { connected: false, error: err }
  }
}
