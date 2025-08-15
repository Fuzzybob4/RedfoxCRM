"use client"

import { useState, useEffect } from "react"
import { checkUserOrganization } from "@/lib/onboarding"
import { useAuth } from "@/app/components/auth-provider"

export function useOnboardingGate() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        // Wait for auth to be ready
        if (authLoading) {
          console.log("Auth still loading...")
          return
        }

        // If no user, they don't need onboarding (they need to login)
        if (!user) {
          console.log("No user found, skipping onboarding check")
          setNeedsOnboarding(false)
          setLoading(false)
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

        setNeedsOnboarding(!hasOrganization)
        setLoading(false)
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        // On error, assume no onboarding needed to prevent blocking
        setNeedsOnboarding(false)
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [user, authLoading])

  return { needsOnboarding, loading }
}
