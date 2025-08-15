import { supabase } from "./supabase"

export interface BusinessInfo {
  businessName: string
  companySize: string
  address?: string
  phone?: string
  email?: string
  website?: string
}

export async function createBusiness(businessInfo: BusinessInfo) {
  console.log("Creating business with info:", businessInfo)

  // Check for authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  console.log("logged-in user id =", user?.id, "error =", userError)

  if (!user) {
    alert("Please sign in first")
    throw new Error("User not authenticated")
  }

  try {
    // Use the RPC function with correct parameter names
    console.log("Attempting RPC function call...")
    const { data, error } = await supabase.rpc("provision_first_org", {
      p_business_name: businessInfo.businessName,
      p_plan: "pro",
      p_company_size: businessInfo.companySize || null,
      p_address: businessInfo.address || null,
      p_phone: businessInfo.phone || null,
      p_email: businessInfo.email || null,
      p_website: businessInfo.website || null,
    })

    console.log("rpc result:", { data, error })

    if (error) {
      console.error("RPC function error:", error)
      throw new Error(`RPC failed: ${error.message}`)
    }

    if (!data) {
      throw new Error("No organization ID returned from RPC")
    }

    console.log("RPC success, organization ID:", data)
    return {
      success: true,
      organizationId: data,
      message: "Business created successfully via RPC",
    }
  } catch (error) {
    console.error("Business creation error:", error)

    // Fallback to direct insert if RPC fails
    console.log("RPC failed, trying direct insert fallback...")

    try {
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert([
          {
            name: businessInfo.businessName,
            plan: "pro",
            owner_id: user.id,
            address: businessInfo.address || null,
            phone: businessInfo.phone || null,
            email: businessInfo.email || null,
            website: businessInfo.website || null,
          },
        ])
        .select("id")
        .single()

      console.log("direct insert ->", { data: orgData, error: orgError })

      if (orgError) {
        throw new Error(`Failed to create organization: ${orgError.message}`)
      }

      // Create membership
      const { error: membershipError } = await supabase.from("memberships").insert([
        {
          org_id: orgData.id,
          user_id: user.id,
          role: "owner",
          is_active: true,
        },
      ])

      if (membershipError) {
        console.error("Membership creation failed:", membershipError)
        // Don't throw here as org was created successfully
      }

      // Update profile default org
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ default_org: orgData.id })
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update failed:", profileError)
        // Don't throw here as org was created successfully
      }

      return {
        success: true,
        organizationId: orgData.id,
        message: "Business created successfully via direct insert",
      }
    } catch (fallbackError) {
      console.error("Fallback insert also failed:", fallbackError)
      throw fallbackError
    }
  }
}

export async function checkUserOrganization() {
  console.log("Checking user organization...")

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  console.log("logged-in user id =", user?.id, "error =", userError)

  if (!user) {
    console.log("No authenticated user found")
    return null
  }

  try {
    const { data: memberships, error } = await supabase
      .from("memberships")
      .select(`
        org_id,
        role,
        organizations (
          id,
          name,
          plan
        )
      `)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1)

    if (error) {
      console.error("Error checking organization:", error)
      return null
    }

    console.log("Organization check result:", memberships)
    return memberships?.[0] || null
  } catch (error) {
    console.error("Unexpected error checking organization:", error)
    return null
  }
}
