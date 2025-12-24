"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/dashboard"
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      const code = searchParams.get("code")

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error("Auth callback error:", error)
          setError(error.message)
          return
        }
      }

      // Get session to verify login
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error("Session error:", sessionError)
        router.replace("/login?message=Authentication failed")
        return
      }

      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", session.user.id)
        .limit(1)
        .maybeSingle()

      if (!membership) {
        // First-time user - redirect to onboarding
        console.log("[v0] New user detected, redirecting to setup-organization")
        router.replace("/setup-organization")
        return
      }

      // Existing user - proceed to dashboard
      console.log("[v0] Existing user detected, proceeding to dashboard")
      router.replace(next)
      router.refresh()
    }

    handleCallback()
  }, [router, searchParams, next])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08042B] to-[#1a1f3a]">
        <div className="text-center">
          <p className="text-red-400 mb-4">Authentication Error: {error}</p>
          <a href="/login" className="text-orange-400 hover:underline">
            Return to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08042B] to-[#1a1f3a]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
        <p className="text-white">Signing you in...</p>
      </div>
    </div>
  )
}
