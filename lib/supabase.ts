import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Cookie utilities for session management
export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window !== "undefined") {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }
}

export const getCookie = (name: string): string | null => {
  if (typeof window !== "undefined") {
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

export const deleteCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }
}

// Auth functions with cookie management
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

    if (data.session?.access_token) {
      setCookie("sb-access-token", data.session.access_token)
      setCookie("sb-refresh-token", data.session.refresh_token)
    }

    return { data, error }
  } catch (error) {
    console.error("Error signing up:", error)
    return { data: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error("Error signing in:", error)
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error("Error signing out:", error)
    return { error }
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  } catch (error) {
    console.error("Error signing in with Google:", error)
    return { data: null, error }
  }
}

export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  } catch (error) {
    console.error("Error resetting password:", error)
    return { data: null, error }
  }
}

export async function updatePassword(password: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })
    return { data, error }
  } catch (error) {
    console.error("Error updating password:", error)
    return { data: null, error }
  }
}

export async function getCurrentUser() {
  try {
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

export async function testConnection() {
  try {
    const { data, error } = await supabase.from("profiles").select("id").limit(1)
    return { connected: !error, data, error }
  } catch (error) {
    console.error("Error testing connection:", error)
    return { connected: false, data: null, error }
  }
}

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN" && session) {
    setCookie("sb-access-token", session.access_token)
    setCookie("sb-refresh-token", session.refresh_token)
  } else if (event === "SIGNED_OUT") {
    deleteCookie("sb-access-token")
    deleteCookie("sb-refresh-token")
  }
})
