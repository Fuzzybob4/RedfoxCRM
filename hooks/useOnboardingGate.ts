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
        console.log("Checking onboarding status...")

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
          console.log("No user found, onboarding not needed")
          setNeedsOnboarding(false)
          setLoading(false)
          return
        }

        console.log("User found:", user.id)

        // Pull profile & memberships
        const [{ data: profile, error: profileError }, { data: memberships, error: membershipError }] =
          await Promise.all([
            supabase.from("profiles").select("default_org").eq("id", user.id).single(),
            supabase.from("memberships").select("org_id, role").eq("user_id", user.id),
          ])

        if (profileError) {
          console.error("Error getting profile:", profileError)
        }

        if (membershipError) {
          console.error("Error getting memberships:", membershipError)
        }

        const hasOrg = (memberships?.length ?? 0) > 0
        const hasDefault = !!profile?.default_org

        console.log("Onboarding check:", {
          hasOrg,
          hasDefault,
          memberships: memberships?.length ?? 0,
          defaultOrg: profile?.default_org,
        })

        const needsOnboardingResult = !(hasOrg && hasDefault)
        setNeedsOnboarding(needsOnboardingResult)

        console.log("Needs onboarding:", needsOnboardingResult)
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
