"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get("next") || "/dashboard"

  useEffect(() => {
    ;(async () => {
      try {
        // Exchange the OAuth code for a Supabase session and set cookies
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.replace("/login?error=callback_failed")
          return
        }

        if (data.session) {
          console.log("Session established:", data.session.user.email)
          router.replace(next)
          router.refresh()
        } else {
          console.log("No session found, redirecting to login")
          router.replace("/login")
        }
      } catch (err) {
        console.error("Callback processing error:", err)
        router.replace("/login?error=callback_error")
      }
    })()
  }, [router, next])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in…</p>
      </div>
    </div>
  )
}
