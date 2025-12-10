"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/components/auth-provider"
import { createClient } from "@/lib/supabase/client"

export function useOnboardingGate() {
  const { user } = useAuth()
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) {
        setNeedsOnboarding(false)
        setLoading(false)
        return
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()

        setNeedsOnboarding(!profile?.onboarding_completed)
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        setNeedsOnboarding(true)
      } finally {
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [user, supabase])

  return { needsOnboarding, loading }
}
