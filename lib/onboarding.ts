import { supabase } from "@/lib/supabase"

export interface BusinessInfo {
  name: string
  industry: string
  size: string
  plan: string
}

export async function createBusiness(businessInfo: BusinessInfo) {
  try {
    console.log("Creating business with info:", businessInfo)

    // Check authentication first
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("logged-in user id =", user?.id, "error =", authError)

    if (authError) {
      console.error("Authentication error:", authError)
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    if (!user) {
      alert("Please sign in first")
      throw new Error("User not authenticated")
    }

    console.log("User authenticated, proceeding with business creation...")

    // Try using the RPC function first (recommended approach)
    console.log("Attempting RPC function call...")
    const { data: rpcResult, error: rpcError } = await supabase.rpc("provision_first_org", {
      org_name: businessInfo.name,
      org_plan: businessInfo.plan,
    })

    if (rpcError) {
      console.error("RPC function error:", rpcError)
      console.log("Falling back to direct insert...")

      // Fallback to direct insert
      const { data: orgData, error: insertError } = await supabase
        .from("organizations")
        .insert([
          {
            name: businessInfo.name,
            plan: businessInfo.plan,
            owner_id: user.id,
          },
        ])
        .select("id")
        .single()

      console.log("direct insert ->", { data: orgData, error: insertError })

      if (insertError) {
        console.error("Direct insert failed:", insertError)
        throw new Error(`Failed to create organization: ${insertError.message}`)
      }

      if (!orgData) {
        throw new Error("No organization data returned from insert")
      }

      // Create membership manually
      const { error: membershipError } = await supabase.from("memberships").insert([
        {
          user_id: user.id,
          org_id: orgData.id,
          role: "owner",
          is_active: true,
        },
      ])

      if (membershipError) {
        console.error("Membership creation failed:", membershipError)
        throw new Error(`Failed to create membership: ${membershipError.message}`)
      }

      // Update profile default org
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ default_org: orgData.id })
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update failed:", profileError)
        // Don't throw here as the org is created, just log the error
      }

      return {
        success: true,
        org_id: orgData.id,
        message: "Organization created successfully via direct insert",
      }
    }

    console.log("RPC function result:", rpcResult)

    if (!rpcResult?.success) {
      throw new Error(rpcResult?.error || "Failed to create organization via RPC")
    }

    return rpcResult
  } catch (error) {
    console.error("Error in createBusiness:", error)
    throw error
  }
}

export async function checkOnboardingStatus() {
  try {
    console.log("Checking onboarding status...")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("logged-in user id =", user?.id, "error =", authError)

    if (authError) {
      console.error("Auth error in onboarding check:", authError)
      return { needsOnboarding: false, user: null, error: authError.message }
    }

    if (!user) {
      console.log("No authenticated user found")
      return { needsOnboarding: false, user: null, error: "No user authenticated" }
    }

    // Check for existing memberships
    const { data: memberships, error: membershipError } = await supabase
      .from("memberships")
      .select("org_id, organizations(name, plan)")
      .eq("user_id", user.id)
      .eq("is_active", true)

    if (membershipError) {
      console.error("Error checking memberships:", membershipError)
      return { needsOnboarding: true, user, error: membershipError.message }
    }

    console.log("User memberships:", memberships)

    const needsOnboarding = !memberships || memberships.length === 0

    return {
      needsOnboarding,
      user,
      memberships,
      error: null,
    }
  } catch (error) {
    console.error("Error in checkOnboardingStatus:", error)
    return {
      needsOnboarding: false,
      user: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
