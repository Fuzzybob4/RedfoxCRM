"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useOnboardingGate() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkOnboardingStatus() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (!mounted) return

        if (userError) {
          console.error("Error getting user:", userError)
          setUser(null)
          setNeedsOnboarding(false)
          setLoading(false)
          return
        }

        setUser(user)

        if (!user) {
          setNeedsOnboarding(false)
          setLoading(false)
          return
        }

        // Check if user has completed onboarding
        const [{ data: profile }, { data: memberships }] = await Promise.all([
          supabase.from("profiles").select("default_org").eq("id", user.id).single(),
          supabase.from("memberships").select("org_id, role, is_active").eq("user_id", user.id).eq("is_active", true),
        ])

        if (!mounted) return

        const hasActiveMembership = (memberships?.length ?? 0) > 0
        const hasDefaultOrg = !!profile?.default_org

        // User needs onboarding if they don't have both an active membership and default org
        const needsOnboarding = !(hasActiveMembership && hasDefaultOrg)

        console.log("Onboarding check:", {
          userId: user.id,
          hasActiveMembership,
          hasDefaultOrg,
          needsOnboarding,
        })

        setNeedsOnboarding(needsOnboarding)
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

  return {
    user,
    needsOnboarding,
    loading,
    refetch: () => {
      setLoading(true)
      // Trigger re-check by updating a dependency
    },
  }
}
