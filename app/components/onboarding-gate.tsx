"use client"

import type React from "react"

import { useOnboardingGate } from "@/hooks/useOnboardingGate"
import { OnboardingWizard } from "@/components/OnboardingWizard"
import { useRouter } from "next/navigation"

interface OnboardingGateProps {
  children: React.ReactNode
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { needsOnboarding, loading } = useOnboardingGate()
  const router = useRouter()

  const handleOnboardingComplete = () => {
    console.log("Onboarding completed, refreshing...")
    router.refresh()
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show onboarding if needed
  if (needsOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />
  }

  // Show normal app
  return <>{children}</>
}
