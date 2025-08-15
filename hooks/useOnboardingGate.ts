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
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (!mounted) return

        if (userError || !user) {
          setUser(null)
          setNeedsOnboarding(false)
          setLoading(false)
          return
        }

        setUser(user)

        // Check if user has completed onboarding
        const [profileResult, membershipsResult] = await Promise.all([
          supabase.from("profiles").select("default_org").eq("id", user.id).single(),
          supabase.from("memberships").select("org_id, role").eq("user_id", user.id),
        ])

        if (!mounted) return

        const profile = profileResult.data
        const memberships = membershipsResult.data || []

        // User needs onboarding if:
        // 1. They have no memberships, OR
        // 2. They don't have a default_org set
        const hasOrg = memberships.length > 0
        const hasDefault = !!profile?.default_org

        console.debug("Onboarding check:", {
          userId: user.id,
          hasOrg,
          hasDefault,
          membershipsCount: memberships.length,
          defaultOrg: profile?.default_org,
          needsOnboarding: !(hasOrg && hasDefault),
        })

        setNeedsOnboarding(!(hasOrg && hasDefault))
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
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
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
