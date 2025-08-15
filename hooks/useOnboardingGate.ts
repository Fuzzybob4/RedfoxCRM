"use client"

import { useEffect, useState } from "react"
import { checkOnboardingStatus } from "@/lib/onboarding"

export function useOnboardingGate() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await checkOnboardingStatus()

        if (result.error) {
          console.log("Onboarding check returned error:", result.error)
          setError(result.error)

          // If it's an auth session missing error, don't show onboarding
          if (result.error.includes("Auth session missing") || result.error.includes("No user authenticated")) {
            setNeedsOnboarding(false)
          } else {
            setNeedsOnboarding(true)
          }
        } else {
          setNeedsOnboarding(result.needsOnboarding)
          setUser(result.user)
          console.log("Onboarding status:", {
            needsOnboarding: result.needsOnboarding,
            hasUser: !!result.user,
            memberships: result.memberships?.length || 0,
          })
        }
      } catch (error) {
        console.error("Error in useOnboardingGate:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        setNeedsOnboarding(false)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  const refetch = async () => {
    const result = await checkOnboardingStatus()
    setNeedsOnboarding(result.needsOnboarding)
    setUser(result.user)
    setError(result.error)
  }

  return { user, needsOnboarding, loading, error, refetch }
}
