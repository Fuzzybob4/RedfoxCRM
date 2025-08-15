"use client"

import { useState, useEffect } from "react"
import { checkOnboardingStatus } from "@/lib/onboarding"

export function useOnboardingGate() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkStatus() {
      try {
        setLoading(true)
        const result = await checkOnboardingStatus()

        if (result.error) {
          console.error("Onboarding check error:", result.error)
          setError(result.error)
          setNeedsOnboarding(false) // Don't show onboarding if there's an auth error
        } else {
          setNeedsOnboarding(result.needsOnboarding)
          setError(null)
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setNeedsOnboarding(false)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  const completeOnboarding = () => {
    setNeedsOnboarding(false)
  }

  return {
    needsOnboarding,
    loading,
    error,
    completeOnboarding,
  }
}
