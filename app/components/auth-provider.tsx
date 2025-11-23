"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

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
    const mockUser = localStorage.getItem("mock_user")
    const mockSession = localStorage.getItem("mock_session")

    if (mockUser && mockSession) {
      setUser(JSON.parse(mockUser))
    }
    setLoading(false)
  }, [])

  const signOut = async () => {
    localStorage.removeItem("mock_user")
    localStorage.removeItem("mock_session")
    setUser(null)
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}
