"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/dashboard"

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the OAuth code for a Supabase session and set cookies
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/login?message=Authentication failed. Please try again.")
          return
        }

        if (data.session) {
          console.log("Auth callback successful, redirecting to:", next)
          router.replace(next)
          router.refresh()
        } else {
          console.log("No session found, redirecting to login")
          router.push("/login?message=Please sign in to continue.")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/login?message=Authentication failed. Please try again.")
      }
    }

    handleAuthCallback()
  }, [router, next])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08042B] to-[#1a1f3a]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Signing you in…</p>
      </div>
    </div>
  )
}
