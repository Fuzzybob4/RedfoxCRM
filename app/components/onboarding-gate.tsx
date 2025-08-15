"use client"

import type React from "react"

import { useOnboardingGate } from "@/hooks/useOnboardingGate"
import { OnboardingWizard } from "@/components/OnboardingWizard"

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { needsOnboarding, loading } = useOnboardingGate()

  // Show loading state while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      {needsOnboarding && <OnboardingWizard open={true} onClose={() => window.location.reload()} />}
    </>
  )
}
