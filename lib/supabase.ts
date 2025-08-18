import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Enhanced getCurrentUser function with better error handling
export async function getCurrentUser() {
  try {
    // Use getSession instead of getUser for better session handling
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Session error:", error)
      return { user: null, error }
    }

    if (!session) {
      // No session is not an error, just return null user
      return { user: null, error: null }
    }

    return { user: session.user, error: null }
  } catch (error) {
    console.error("GetUser error:", error)
    return { user: null, error }
  }
}

// Enhanced signIn function with timeout
export async function signIn(email: string, password: string) {
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 10000))

    const signInPromise = supabase.auth.signInWithPassword({
      email,
      password,
    })

    const { data, error } = (await Promise.race([signInPromise, timeoutPromise])) as any

    if (error) {
      console.error("Sign in error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Sign in timeout or network error:", error)
    return {
      data: null,
      error: {
        message: "Connection timeout. Please check your internet connection and try again.",
      },
    }
  }
}

// Enhanced signUp function
export async function signUp(email: string, password: string, fullName?: string) {
  try {
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
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      console.error("Google SignIn error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Google SignIn catch error:", err)
    return {
      data: null,
      error: {
        message: "Network error. Please check your connection and try again.",
        name: "NetworkError",
      },
    }
  }
}

// Enhanced signOut function
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error }
  }
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
