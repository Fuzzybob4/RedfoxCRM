"use client"

import { useOnboardingGate } from "@/hooks/useOnboardingGate"
import { OnboardingWizard } from "@/components/OnboardingWizard"

export function OnboardingGate() {
  const { needsOnboarding, loading } = useOnboardingGate()

  // Don't render anything while loading
  if (loading) {
    return null
  }

  // Only show the wizard if the user needs onboarding
  if (!needsOnboarding) {
    return null
  }

  return (
    <OnboardingWizard
      open={true}
      onClose={() => {
        // Refresh the page to update the auth state
        window.location.reload()
      }}
    />
  )
}
