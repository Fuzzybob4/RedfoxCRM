"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Session error:", error)
      } else {
        setSession(session)
        setUser(session?.user || null)
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setLoading(false)
    }
  }

  const testSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  if (loading) {
    return <div className="p-8 text-white">Loading auth test...</div>
  }

  return (
    <div className="min-h-screen bg-[#08042B] p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Authentication Test</h1>

        <Card className="p-6 bg-white/10 border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Session Status</h2>
          <div className="space-y-2 text-white">
            <p>
              <strong>Logged In:</strong> {user ? "✅ Yes" : "❌ No"}
            </p>
            {user && (
              <>
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Email Confirmed:</strong> {user.email_confirmed_at ? "✅ Yes" : "❌ No"}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}
                </p>
              </>
            )}
          </div>

          {user && (
            <Button onClick={testSignOut} className="mt-4 bg-red-600 hover:bg-red-700">
              Test Sign Out
            </Button>
          )}
        </Card>

        <Card className="p-6 bg-white/10 border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Navigation Test</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button asChild className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
              <a href="/login">Login Page</a>
            </Button>
            <Button asChild className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
              <a href="/signup">Signup Page</a>
            </Button>
            <Button asChild className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
              <a href="/dashboard">Dashboard</a>
            </Button>
            <Button asChild className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
              <a href="/customers">Customers</a>
            </Button>
            <Button asChild className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
              <a href="/sales">Sales</a>
            </Button>
            <Button asChild className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
              <a href="/invoices">Invoices</a>
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white/10 border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Environment Check</h2>
          <div className="space-y-2 text-white">
            <p>
              <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
            </p>
            <p>
              <strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
            </p>
            <p>
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
