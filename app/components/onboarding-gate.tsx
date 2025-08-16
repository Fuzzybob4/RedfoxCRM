"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { OnboardingWizard } from "@/components/OnboardingWizard"
import { useOnboardingGate } from "@/hooks/useOnboardingGate"

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const { needsOnboarding, loading: onboardingLoading } = useOnboardingGate()

  if (loading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-[#08042B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F5F906]"></div>
      </div>
    )
  }

  if (user && needsOnboarding) {
    return <OnboardingWizard />
  }

  return <>{children}</>
}
