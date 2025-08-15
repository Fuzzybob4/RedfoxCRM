import { supabase } from "./supabase"

export interface BusinessInfo {
  businessName: string
  companySize: string
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
    // First try using the RPC function (recommended approach)
    console.log("Attempting RPC function call...")
    const { data: rpcData, error: rpcError } = await supabase.rpc("provision_first_org", {
      org_name: businessInfo.businessName,
      org_plan: "pro",
      company_size: businessInfo.companySize,
    })

    if (!rpcError && rpcData?.success) {
      console.log("RPC success:", rpcData)
      return {
        success: true,
        organizationId: rpcData.organization_id,
        message: "Business created successfully via RPC",
      }
    }

    console.log("RPC failed, trying direct insert...", rpcError)

    // Fallback to direct insert
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert([
        {
          name: businessInfo.businessName,
          plan: "pro",
          owner_id: user.id,
          company_size: businessInfo.companySize,
        },
      ])
      .select("id")
      .single()

    console.log("direct insert ->", { data: orgData, error: orgError })

    if (orgError) {
      throw new Error(`Failed to create organization: ${orgError.message}`)
    }

    // Create membership
    const { error: membershipError } = await supabase.from("organization_memberships").insert([
      {
        user_id: user.id,
        organization_id: orgData.id,
        role: "owner",
      },
    ])

    if (membershipError) {
      console.error("Membership creation failed:", membershipError)
      // Don't throw here as org was created successfully
    }

    return {
      success: true,
      organizationId: orgData.id,
      message: "Business created successfully via direct insert",
    }
  } catch (error) {
    console.error("Business creation error:", error)
    throw error
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
      .from("organization_memberships")
      .select(`
        organization_id,
        role,
        organizations (
          id,
          name,
          plan,
          company_size
        )
      `)
      .eq("user_id", user.id)
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
