"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../app/components/auth-provider"
import { supabase } from "../lib/supabase"

export function useOnboardingGate() {
  const { user, loading: authLoading } = useAuth()
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user || authLoading) {
        setLoading(false)
        return
      }

      try {
        // Check if user has completed onboarding
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error checking onboarding status:", error)
          setNeedsOnboarding(true)
        } else {
          setNeedsOnboarding(!profile?.onboarding_completed)
        }
      } catch (error) {
        console.error("Error in onboarding check:", error)
        setNeedsOnboarding(true)
      } finally {
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [user, authLoading])

  return { needsOnboarding, loading }
}
