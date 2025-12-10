"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().finally(() => setReady(true))

    const { data: sub } = supabase.auth.onAuthStateChange(() => router.refresh())

    return () => sub.subscription.unsubscribe()
  }, [router, supabase])

  if (!ready) return null

  return <>{children}</>
}
