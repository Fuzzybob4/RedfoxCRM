"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, refreshSession } from "@/lib/supabase"
import type { ReactNode } from "react"
import type { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoggedIn: boolean
  loading: boolean
  setIsLoggedIn: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoggedIn: false,
  loading: true,
  setIsLoggedIn: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Check for existing auth cookies
        const cookies = document.cookie.split(";")
        const hasAuthCookies = cookies.some(
          (cookie) => cookie.trim().startsWith("sb-access-token") || cookie.trim().startsWith("sb-refresh-token"),
        )

        console.debug("Auth provider initialization:", {
          hasAuthCookies,
          timestamp: new Date().toISOString(),
        })

        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          return
        }

        if (session) {
          console.debug("Initial session loaded:", {
            userId: session.user.id,
            expiresAt: new Date(session.expires_at! * 1000).toISOString(),
            timestamp: new Date().toISOString(),
          })
          setSession(session)
          setUser(session.user)
          setIsLoggedIn(true)

          // Set up session refresh timer
          const timeUntilExpiry = new Date(session.expires_at! * 1000).getTime() - Date.now()
          const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0) // Refresh 5 minutes before expiry

          refreshTimer = setTimeout(async () => {
            const refreshedSession = await refreshSession()
            if (refreshedSession) {
              setSession(refreshedSession)
              setUser(refreshedSession.user)
            }
          }, refreshTime)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.debug("Auth state change:", {
        event,
        userId: session?.user?.id,
        hasSession: !!session,
        timestamp: new Date().toISOString(),
      })

      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null)
        setSession(session)
        setIsLoggedIn(true)
        router.refresh()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setSession(null)
        setIsLoggedIn(false)
        router.refresh()
        router.push("/login") // Redirect to login page on sign out
      } else if (event === "TOKEN_REFRESHED") {
        setSession(session)
        if (session?.user) {
          setUser(session.user)
        }
      }
    })

    // Cleanup
    return () => {
      subscription.unsubscribe()
      if (refreshTimer) {
        clearTimeout(refreshTimer)
      }
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoggedIn,
        loading,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
