"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type UserRole, type RolePermissions, type Permission, rolePermissions, mockAuth } from "@/lib/supabase"

interface User {
  id: string
  email: string
  name?: string
  role?: UserRole
  user_metadata?: {
    full_name?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  role: UserRole | null
  permissions: RolePermissions | null
  hasPermission: (feature: keyof RolePermissions, action: keyof Permission) => boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  role: null,
  permissions: null,
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
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [permissions, setPermissions] = useState<RolePermissions | null>(null)

  useEffect(() => {
    const mockUser = mockAuth.getUser()

    if (mockUser) {
      const formattedUser: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        user_metadata: {
          full_name: mockUser.name,
        },
      }
      setUser(formattedUser)
      setRole(mockUser.role)
      setPermissions(rolePermissions[mockUser.role])
    }
    setLoading(false)
  }, [])

  const hasPermission = (feature: keyof RolePermissions, action: keyof Permission): boolean => {
    if (!role || !permissions) return false
    return permissions[feature]?.[action] ?? false
  }

  const signOut = async () => {
    await mockAuth.signOut()
    setUser(null)
    setRole(null)
    setPermissions(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, role, permissions, hasPermission, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
