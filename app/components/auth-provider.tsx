"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { type UserRole, type Permission, rolePermissions } from "@/lib/permissions"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  role: UserRole | null
  hasPermission: (feature: string, action: keyof Permission) => boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  hasPermission: () => false,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<UserRole | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        // Fetch role from user_memberships or profiles
        const { data: membership } = await supabase
          .from("user_memberships")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle()
        setRole((membership?.role as UserRole) || "user")
      }
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: membership } = await supabase
          .from("user_memberships")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle()
        setRole((membership?.role as UserRole) || "user")
      } else {
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const hasPermission = (feature: string, action: keyof Permission): boolean => {
    if (!role) return false
    const featurePerms = rolePermissions[role]?.[feature as keyof typeof rolePermissions.user]
    return featurePerms?.[action] ?? false
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, loading, role, hasPermission, signOut }}>{children}</AuthContext.Provider>
}
