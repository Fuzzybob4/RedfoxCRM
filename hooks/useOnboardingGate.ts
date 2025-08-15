"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface OnboardingState {
  needsOnboarding: boolean | null
  user: User | null
  loading: boolean
}

export function useOnboardingGate(): OnboardingState {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkOnboardingStatus = async () => {
      try {
        console.log("Checking onboarding status...")

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (!mounted) return

        if (userError) {
          console.error("User error:", userError)
          setUser(null)
          setNeedsOnboarding(false)
          setLoading(false)
          return
        }

        if (!user) {
          console.log("No authenticated user")
          setUser(null)
          setNeedsOnboarding(false)
          setLoading(false)
          return
        }

        console.log("User authenticated:", user.id)
        setUser(user)

        // Check if user has completed onboarding
        console.log("Checking profile and memberships...")

        const [profileResult, membershipsResult] = await Promise.all([
          supabase.from("profiles").select("default_org").eq("id", user.id).single(),
          supabase.from("memberships").select("org_id, role, is_active").eq("user_id", user.id).eq("is_active", true),
        ])

        if (!mounted) return

        console.log("Profile result:", profileResult)
        console.log("Memberships result:", membershipsResult)

        const profile = profileResult.data
        const memberships = membershipsResult.data || []

        // User needs onboarding if:
        // 1. They have no active memberships, OR
        // 2. They don't have a default_org set
        const hasActiveMembership = memberships.length > 0
        const hasDefault = !!profile?.default_org

        console.log("Onboarding check:", {
          userId: user.id,
          hasActiveMembership,
          hasDefault,
          membershipsCount: memberships.length,
          defaultOrg: profile?.default_org,
          needsOnboarding: !(hasActiveMembership && hasDefault),
        })

        setNeedsOnboarding(!(hasActiveMembership && hasDefault))
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        if (mounted) {
          setNeedsOnboarding(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkOnboardingStatus()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session)
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setLoading(true)
        checkOnboardingStatus()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, needsOnboarding, loading }
}
