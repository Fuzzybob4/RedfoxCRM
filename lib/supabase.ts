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

// Mock authentication functions for testing
export const mockAuth = {
  signIn: async (email: string, password: string) => {
    // Mock user data for testing
    const mockUsers = {
      "demo@example.com": { id: "demo-user-123", email: "demo@example.com" },
      "john@example.com": { id: "john-doe-456", email: "john@example.com" },
      "jane@example.com": { id: "jane-smith-789", email: "jane@example.com" },
      "test@example.com": { id: "test-user-001", email: "test@example.com" },
    }

    const mockPasswords = {
      "demo@example.com": "demo123",
      "john@example.com": "john123",
      "jane@example.com": "jane123",
      "test@example.com": "test123",
    }

    if (mockUsers[email as keyof typeof mockUsers] && mockPasswords[email as keyof typeof mockPasswords] === password) {
      const user = mockUsers[email as keyof typeof mockUsers]
      // Store in localStorage for persistence
      localStorage.setItem("mockUser", JSON.stringify(user))
      return { data: { user }, error: null }
    }

    return { data: { user: null }, error: { message: "Invalid credentials" } }
  },

  signOut: async () => {
    localStorage.removeItem("mockUser")
    return { error: null }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem("mockUser")
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },
}
