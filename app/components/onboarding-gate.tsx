"use client"

import type React from "react"

import { useOnboardingGate } from "@/hooks/useOnboardingGate"
import { OnboardingWizard } from "@/components/OnboardingWizard"

interface OnboardingGateProps {
  children: React.ReactNode
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { needsOnboarding, loading, error, completeOnboarding } = useOnboardingGate()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Show error state or normal app if there's an auth error
  if (error) {
    console.error("Auth error in onboarding gate:", error)
    return <>{children}</>
  }

  // Show onboarding if needed
  if (needsOnboarding) {
    return <OnboardingWizard onComplete={completeOnboarding} />
  }

  // Show normal app
  return <>{children}</>
}
