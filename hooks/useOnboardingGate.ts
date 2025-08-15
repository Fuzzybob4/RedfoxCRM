"use client"

import { useEffect, useState } from "react"
import { checkUserOrganization } from "@/lib/onboarding"
import { useAuth } from "@/app/components/auth-provider"

export function useOnboardingGate() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        setIsLoading(true)
        setError(null)

        // Wait for auth to be ready
        if (authLoading) {
          console.log("Auth still loading...")
          return
        }

        // If no user, they don't need onboarding (show home page)
        if (!user) {
          console.log("No user found, showing home page")
          setNeedsOnboarding(false)
          setIsLoading(false)
          return
        }

        console.log("Checking onboarding status for user:", user.id)

        const organization = await checkUserOrganization()
        const hasOrganization = !!organization

        console.log("Organization check result:", {
          hasOrganization,
          organization: organization
            ? {
                id: organization.organizations?.id,
                name: organization.organizations?.name,
              }
            : null,
        })

        // Only show onboarding if user is logged in AND doesn't have an organization
        setNeedsOnboarding(!hasOrganization)
        setIsLoading(false)
      } catch (err) {
        console.error("Error checking onboarding status:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        // Default to not showing onboarding on error (show home page)
        setNeedsOnboarding(false)
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [user, authLoading])

  const completeOnboarding = () => {
    setNeedsOnboarding(false)
  }

  return {
    needsOnboarding,
    isLoading,
    error,
    completeOnboarding,
  }
}
