"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/components/auth-provider"
import { supabase } from "@/lib/supabase"

export function useOnboardingGate() {
  const { user } = useAuth()
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) {
        setNeedsOnboarding(false)
        setLoading(false)
        return
      }

      try {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()

        setNeedsOnboarding(!profile?.onboarding_completed)
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        // If there's an error, assume onboarding is needed
        setNeedsOnboarding(true)
      } finally {
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [user])

  return { needsOnboarding, loading }
}
