"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get("next") || "/dashboard"
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      await supabase.auth.getSession()
      router.replace(next)
      router.refresh()
    })()
  }, [router, next, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08042B] to-[#1a1f3a]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
        <p className="text-white">Signing you in...</p>
      </div>
    </div>
  )
}
