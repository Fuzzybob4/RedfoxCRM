"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import { OnboardingWizard } from "../../components/OnboardingWizard"
import { useOnboardingGate } from "../../hooks/useOnboardingGate"

interface OnboardingGateProps {
  children: React.ReactNode
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { user, loading } = useAuth()
  const { needsOnboarding, loading: onboardingLoading } = useOnboardingGate()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!loading && !onboardingLoading && user && needsOnboarding) {
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }
  }, [user, needsOnboarding, loading, onboardingLoading])

  if (loading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08042B]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingWizard />
  }

  return <>{children}</>
}
