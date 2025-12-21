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
        .single()

      if (!membership) {
        // New user - create organization and membership
        const userMeta = session.user.user_metadata
        const companyName = userMeta?.company_name || `${userMeta?.full_name || session.user.email}'s Organization`

        // Create organization
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({ name: companyName })
          .select("id")
          .single()

        if (orgError) {
          console.error("Error creating organization:", orgError)
        } else if (org) {
          // Create membership
          await supabase.from("user_memberships").insert({
            user_id: session.user.id,
            org_id: org.id,
            role: "owner",
          })

          // Create business profile
          await supabase.from("business_profiles").insert({
            org_id: org.id,
            business_name: companyName,
            email: session.user.email,
            phone: userMeta?.phone_number || null,
          })

          // Create profile if not exists
          await supabase.from("profiles").upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: userMeta?.full_name || null,
            role: "owner",
          })
        }
      }

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
