"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { mockAuth } from "@/lib/supabase"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
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

  useEffect(() => {
    // Check for existing session
    const mockUser = mockAuth.getUser()
    setUser(mockUser)
    setLoading(false)
  }, [])

  const signOut = async () => {
    await mockAuth.signOut()
    setUser(null)
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}
