import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
  global: {
    headers: {
      "X-Client-Info": "redfox-crm",
    },
  },
  db: {
    schema: "public",
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})

// Enhanced auth helpers with better error handling
export const signUp = async (email: string, password: string, fullName?: string) => {
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

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("SignIn error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error("SignIn catch error:", err)
    return {
      data: null,
      error: {
        message: "Network error. Please check your connection and try again.",
        name: "NetworkError",
      },
    }
  }
}

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
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

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("SignOut error:", error)
    }
    return { error }
  } catch (err) {
    console.error("SignOut catch error:", err)
    return {
      error: {
        message: "Network error during sign out.",
        name: "NetworkError",
      },
    }
  }
}

export const getCurrentUser = async () => {
  try {
    // First try to get the session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return { user: null, error: sessionError }
    }

    if (!session) {
      // No session found, but this is not an error
      return { user: null, error: null }
    }

    // If we have a session, return the user
    return { user: session.user, error: null }
  } catch (err) {
    console.error("GetUser catch error:", err)
    return {
      user: null,
      error: {
        message: "Network error getting user.",
        name: "NetworkError",
      },
    }
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
