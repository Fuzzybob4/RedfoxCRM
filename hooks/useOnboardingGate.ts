"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useOnboardingGate() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error getting user:", userError)
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

        // Pull profile & memberships
        const [{ data: profile, error: profileError }, { data: memberships, error: membershipError }] =
          await Promise.all([
            supabase.from("profiles").select("default_org").eq("id", user.id).single(),
            supabase.from("memberships").select("org_id, role, is_active").eq("user_id", user.id).eq("is_active", true),
          ])

        if (profileError) {
          console.error("Error fetching profile:", profileError)
        }

        if (membershipError) {
          console.error("Error fetching memberships:", membershipError)
        }

        const hasActiveMembership = (memberships?.length ?? 0) > 0
        const hasDefaultOrg = !!profile?.default_org

        console.log("Onboarding check:", {
          hasActiveMembership,
          hasDefaultOrg,
          memberships,
          profile,
        })

        // Show onboarding if user has no active memberships OR no default org
        setNeedsOnboarding(!(hasActiveMembership && hasDefaultOrg))
      } catch (error) {
        console.error("Error in onboarding gate:", error)
        setNeedsOnboarding(false)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { user, needsOnboarding, loading }
}
