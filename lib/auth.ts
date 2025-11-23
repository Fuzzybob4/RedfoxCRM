const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-supabase.example.com"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key"

// Mock user database for testing
const mockUsers = new Map<string, { email: string; password: string; fullName?: string }>()

const useMockAuth = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function handleSignUp(data: {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  companyName?: string
  subscriptionType?: string
  billingPeriod?: string
  cost?: number
}) {
  const { email, password, firstName, lastName } = data
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : undefined

  if (useMockAuth) {
    try {
      // Check if user already exists
      if (mockUsers.has(email)) {
        return {
          success: false,
          data: null,
          error: { message: "User already registered" },
        }
      }

      // Store user in mock database
      mockUsers.set(email, { email, password, fullName })

      // Store in localStorage as well for persistence
      if (typeof window !== "undefined") {
        const existingUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]")
        existingUsers.push({ email, password, fullName })
        localStorage.setItem("mockUsers", JSON.stringify(existingUsers))
      }

      return {
        success: true,
        data: { user: { email, id: `mock-${Date.now()}` } },
        error: null,
      }
    } catch (error) {
      console.error("Error in mock handleSignUp:", error)
      return {
        success: false,
        data: null,
        error: { message: error instanceof Error ? error.message : "An error occurred" },
      }
    }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    return {
      success: !error,
      data: authData,
      error,
    }
  } catch (error) {
    console.error("Error in handleSignUp:", error)
    return {
      success: false,
      data: null,
      error: { message: error instanceof Error ? error.message : "An error occurred" },
    }
  }
}

export async function handleSignIn(email: string, password: string) {
  if (useMockAuth) {
    try {
      // Load users from localStorage
      if (typeof window !== "undefined") {
        const existingUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]")
        const user = existingUsers.find((u: any) => u.email === email && u.password === password)

        if (user) {
          // Store session
          const session = {
            user: { email, id: `mock-${email}` },
            access_token: "mock-token",
            expires_at: Date.now() + 3600000,
          }
          localStorage.setItem("mockSession", JSON.stringify(session))
          document.cookie = `mockSession=${JSON.stringify(session)}; path=/; max-age=3600`

          return { data: { user, session }, error: null }
        }

        return { data: null, error: { message: "Invalid credentials" } }
      }
      return { data: null, error: { message: "Window not available" } }
    } catch (error) {
      console.error("Error in mock handleSignIn:", error)
      return { data: null, error }
    }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { data, error }
  } catch (error) {
    console.error("Error in handleSignIn:", error)
    return { data: null, error }
  }
}

export async function handleSignOut() {
  if (useMockAuth) {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mockSession")
        document.cookie = "mockSession=; path=/; max-age=0"
      }
      return { error: null }
    } catch (error) {
      console.error("Error in mock handleSignOut:", error)
      return { error }
    }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error("Error in handleSignOut:", error)
    return { error }
  }
}

export async function getSession() {
  if (useMockAuth) {
    try {
      if (typeof window !== "undefined") {
        const sessionStr = localStorage.getItem("mockSession")
        if (sessionStr) {
          const session = JSON.parse(sessionStr)
          return { session, error: null }
        }
      }
      return { session: null, error: null }
    } catch (error) {
      console.error("Error getting mock session:", error)
      return { session: null, error }
    }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    return { session, error }
  } catch (error) {
    console.error("Error getting session:", error)
    return { session: null, error }
  }
}

export async function getCurrentUser() {
  if (useMockAuth) {
    try {
      if (typeof window !== "undefined") {
        const sessionStr = localStorage.getItem("mockSession")
        if (sessionStr) {
          const session = JSON.parse(sessionStr)
          return { user: session.user, error: null }
        }
      }
      return { user: null, error: null }
    } catch (error) {
      console.error("Error getting mock current user:", error)
      return { user: null, error }
    }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { user: null, error }
  }
}
