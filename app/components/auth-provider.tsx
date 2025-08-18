"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, getCurrentUser, signOut as supabaseSignOut } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  retry: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
  retry: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const initializeAuth = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Initializing auth...")

      // Get initial session with timeout
      const sessionPromise = getCurrentUser()
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Session timeout")), 10000))

      const result = (await Promise.race([sessionPromise, timeoutPromise])) as any

      if (result.error && result.error.message !== "Network error getting user.") {
        console.error("Session error:", result.error)
        setError("Failed to load session. Please refresh the page.")
        setUser(null)
      } else if (result.user) {
        console.log("User found:", result.user.email)
        setUser(result.user)
        setError(null)
      } else {
        console.log("No user session found")
        setUser(null)
        setError(null)
      }
    } catch (err) {
      console.error("Auth initialization error:", err)
      setError("Connection error. Please check your internet connection.")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initializeAuth()

    // Listen for auth changes with error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log("Auth state changed:", event, session?.user?.email)

        if (session?.user) {
          setUser(session.user)
          setError(null)
        } else {
          setUser(null)
        }

        setLoading(false)

        // Handle specific auth events
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in, redirecting to dashboard")
          router.push("/dashboard")
          router.refresh()
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out, redirecting to home")
          setUser(null)
          router.push("/")
          router.refresh()
        }
      } catch (err) {
        console.error("Auth state change error:", err)
        setError("Authentication error occurred.")
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)
      console.log("Signing out...")

      const { error } = await supabaseSignOut()

      if (error) {
        console.error("Sign out error:", error)
        setError("Failed to sign out. Please try again.")
      } else {
        setUser(null)
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      console.error("Sign out catch error:", err)
      setError("Failed to sign out. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const retry = () => {
    console.log("Retrying auth initialization...")
    initializeAuth()
  }

  return <AuthContext.Provider value={{ user, loading, error, signOut, retry }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
