import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export async function getUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      console.error("Error getting user:", error)
      return null
    }
    return user
  } catch (error) {
    console.error("Error in getUser:", error)
    return null
  }
}

export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) {
      console.error("Error getting session:", error)
      return null
    }
    return session
  } catch (error) {
    console.error("Error in getSession:", error)
    return null
  }
}

export async function handleSignUp(email: string, password: string, fullName?: string) {
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
      console.error("Sign up error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in handleSignUp:", error)
    return { data: null, error }
  }
}

export async function handleSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Sign in error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in handleSignIn:", error)
    return { data: null, error }
  }
}

export async function handleSignOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
      return { error }
    }
    return { error: null }
  } catch (error) {
    console.error("Error in handleSignOut:", error)
    return { error }
  }
}

export async function handlePasswordReset(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in handlePasswordReset:", error)
    return { data: null, error }
  }
}
