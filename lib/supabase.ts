import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type UserRole = "super_admin" | "admin" | "manager" | "user" | "viewer"

export interface Permission {
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

export interface RolePermissions {
  dashboard: Permission
  customers: Permission
  invoices: Permission
  estimates: Permission
  projects: Permission
  reports: Permission
  mapping: Permission
  scheduling: Permission
  products: Permission
  sales: Permission
  settings: Permission
  admin: Permission
  billing: Permission
  users: Permission
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  super_admin: {
    dashboard: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    customers: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    invoices: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    estimates: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    projects: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    reports: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    mapping: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    scheduling: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    products: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    sales: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    settings: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    admin: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    billing: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    users: { canView: true, canCreate: true, canEdit: true, canDelete: true },
  },
  admin: {
    dashboard: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    customers: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    invoices: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    estimates: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    projects: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    reports: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    mapping: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    scheduling: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    products: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    sales: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    settings: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    admin: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    billing: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    users: { canView: true, canCreate: true, canEdit: true, canDelete: false },
  },
  manager: {
    dashboard: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    customers: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    invoices: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    estimates: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    projects: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    reports: { canView: true, canCreate: true, canEdit: false, canDelete: false },
    mapping: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    scheduling: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    products: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    sales: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    settings: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    admin: { canView: false, canCreate: false, canEdit: false, canDelete: false },
    billing: { canView: false, canCreate: false, canEdit: false, canDelete: false },
    users: { canView: true, canCreate: false, canEdit: false, canDelete: false },
  },
  user: {
    dashboard: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    customers: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    invoices: { canView: true, canCreate: true, canEdit: false, canDelete: false },
    estimates: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    projects: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    reports: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    mapping: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    scheduling: { canView: true, canCreate: true, canEdit: true, canDelete: false },
    products: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    sales: { canView: true, canCreate: true, canEdit: false, canDelete: false },
    settings: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    admin: { canView: false, canCreate: false, canEdit: false, canDelete: false },
    billing: { canView: false, canCreate: false, canEdit: false, canDelete: false },
    users: { canView: false, canCreate: false, canEdit: false, canDelete: false },
  },
  viewer: {
    dashboard: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    customers: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    invoices: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    estimates: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    projects: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    reports: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    mapping: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    scheduling: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    products: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    sales: { canView: true, canCreate: false, canEdit: false, canDelete: false },
    settings: { canView: false, canCreate: false, canEdit: false, canDelete: false },
    admin: { canView: false, canCreate: false, canEdit: false, canDelete: false },
    billing: { canView: false, canCreate: false, canEdit: false, canDelete: false },
    users: { canView: false, canCreate: false, canEdit: false, canDelete: false },
  },
}

export interface MockUser {
  id: string
  email: string
  name: string
  role: UserRole
}

// Mock authentication functions for testing
export const mockAuth = {
  signIn: async (email: string, password: string) => {
    const mockUsers: Record<string, MockUser> = {
      "owner@example.com": {
        id: "super-admin-000",
        email: "owner@example.com",
        name: "Business Owner",
        role: "super_admin",
      },
      "admin@example.com": { id: "admin-user-001", email: "admin@example.com", name: "Admin User", role: "admin" },
      "manager@example.com": {
        id: "manager-user-002",
        email: "manager@example.com",
        name: "Manager User",
        role: "manager",
      },
      "user@example.com": { id: "standard-user-003", email: "user@example.com", name: "Standard User", role: "user" },
      "viewer@example.com": { id: "viewer-user-004", email: "viewer@example.com", name: "Viewer User", role: "viewer" },
    }

    const mockPasswords: Record<string, string> = {
      "owner@example.com": "owner123",
      "admin@example.com": "admin123",
      "manager@example.com": "manager123",
      "user@example.com": "user123",
      "viewer@example.com": "viewer123",
    }

    if (mockUsers[email] && mockPasswords[email] === password) {
      const user = mockUsers[email]
      localStorage.setItem("mock_user", JSON.stringify(user))
      localStorage.setItem("mockUser", JSON.stringify(user))
      localStorage.setItem("mock_session", "true")

      const sessionData = {
        userId: user.id,
        email: user.email,
        role: user.role,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }
      document.cookie = `test-auth-session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`

      return { data: { user }, error: null }
    }

    return { data: { user: null }, error: { message: "Invalid credentials" } }
  },

  signOut: async () => {
    localStorage.removeItem("mock_user")
    localStorage.removeItem("mockUser")
    localStorage.removeItem("mock_session")
    document.cookie = "test-auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    return { error: null }
  },

  getUser: (): MockUser | null => {
    if (typeof window === "undefined") return null
    try {
      const user = localStorage.getItem("mock_user") || localStorage.getItem("mockUser")
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  hasPermission: (feature: keyof RolePermissions, action: keyof Permission): boolean => {
    const user = mockAuth.getUser()
    if (!user) return false
    return rolePermissions[user.role][feature][action]
  },

  getRole: (): UserRole | null => {
    const user = mockAuth.getUser()
    return user?.role || null
  },

  getPermissions: (): RolePermissions | null => {
    const user = mockAuth.getUser()
    if (!user) return null
    return rolePermissions[user.role]
  },
}
