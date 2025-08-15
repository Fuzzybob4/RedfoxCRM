"use client"

import { useOnboardingGate } from "@/hooks/useOnboardingGate"
import { OnboardingWizard } from "@/components/OnboardingWizard"

export function OnboardingGate() {
  const { needsOnboarding, loading } = useOnboardingGate()

  // Don't render anything while loading
  if (loading) return null

  // Don't render if onboarding is not needed
  if (!needsOnboarding) return null

  return (
    <OnboardingWizard
      open={true}
      onClose={() => {
        // Refresh the page to update the onboarding state
        window.location.reload()
      }}
    />
  )
}
