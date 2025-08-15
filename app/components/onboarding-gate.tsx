"use client"

import type React from "react"

import { useOnboardingGate } from "@/hooks/useOnboardingGate"
import { OnboardingWizard } from "@/components/OnboardingWizard"
import { useAuth } from "./auth-provider"

interface OnboardingGateProps {
  children: React.ReactNode
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const { needsOnboarding, loading: onboardingLoading, error, refetch } = useOnboardingGate()

  // Show loading while checking auth and onboarding status
  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If there's an auth error and user is not logged in, show children (login page)
  if (error && !isLoggedIn) {
    console.log("Auth error and not logged in, showing children:", error)
    return <>{children}</>
  }

  // If user is logged in and needs onboarding, show wizard
  if (isLoggedIn && needsOnboarding) {
    return (
      <OnboardingWizard
        onComplete={() => {
          console.log("Onboarding completed, refetching status...")
          refetch()
        }}
      />
    )
  }

  // Otherwise, show the normal app
  return <>{children}</>
}
