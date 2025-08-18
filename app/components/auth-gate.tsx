"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Wait for Supabase to initialize before checking auth state
    supabase.auth.getSession().finally(() => setReady(true))

    // Listen for auth state changes and refresh router
    const { data: sub } = supabase.auth.onAuthStateChange(() => router.refresh())

    return () => sub.subscription.unsubscribe()
  }, [router])

  // Don't render anything until Supabase is ready
  if (!ready) return null

  return <>{children}</>
}
