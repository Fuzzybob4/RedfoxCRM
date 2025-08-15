"use client"

import { OnboardingWizard } from "@/components/OnboardingWizard"
import { useOnboardingGate } from "@/hooks/useOnboardingGate"

export function OnboardingGate() {
  const { needsOnboarding, loading } = useOnboardingGate()

  if (loading) {
    return null // Don't show anything while loading
  }

  if (!needsOnboarding) {
    return null
  }

  return (
    <OnboardingWizard
      open={true}
      onClose={() => {
        // Refresh the page to reload the onboarding state
        window.location.reload()
      }}
    />
  )
}
