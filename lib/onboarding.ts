import { supabase } from "./supabase"

export async function checkUserOrganization() {
  try {
    console.log("Checking user organization...")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("Auth error:", userError)
      throw new Error(`Auth error: ${userError.message}`)
    }

    if (!user) {
      console.log("No authenticated user found")
      return null
    }

    console.log("User found:", user.id)

    // Check if user has any memberships
    const { data: memberships, error: membershipError } = await supabase
      .from("memberships")
      .select(`
        id,
        role,
        org_id,
        organizations (
          id,
          name,
          plan
        )
      `)
      .eq("user_id", user.id)
      .limit(1)

    if (membershipError) {
      console.error("Membership query error:", membershipError)
      throw new Error(`Database error: ${membershipError.message}`)
    }

    console.log("Memberships found:", memberships)

    return memberships && memberships.length > 0 ? memberships[0] : null
  } catch (error) {
    console.error("Error in checkUserOrganization:", error)
    throw error
  }
}

export async function createBusinessStep1(businessName: string, companySize: string, plan = "pro") {
  try {
    console.log("Creating business step 1...")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("Please sign in first")
    }

    console.log("User authenticated:", user.id)

    // Use RPC function to create organization
    const { data: orgId, error } = await supabase.rpc("provision_first_org", {
      p_business_name: businessName,
      p_plan: plan,
      p_company_size: companySize,
      p_address: null,
      p_phone: null,
      p_email: null,
      p_website: null,
    })

    console.log("RPC result:", { data: orgId, error })

    if (error) {
      console.error("RPC error:", error)
      throw new Error(`Failed to create organization: ${error.message}`)
    }

    if (!orgId) {
      throw new Error("No organization ID returned")
    }

    console.log("Organization created with ID:", orgId)
    return orgId
  } catch (error) {
    console.error("Error in createBusinessStep1:", error)
    throw error
  }
}

export async function updateBusinessStep2(
  orgId: string,
  businessEmail?: string,
  phoneNumber?: string,
  website?: string,
  address?: string,
) {
  try {
    console.log("Updating business step 2 for org:", orgId)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("Please sign in first")
    }

    // Update organization with contact information
    const { data, error } = await supabase
      .from("organizations")
      .update({
        email: businessEmail || null,
        phone: phoneNumber || null,
        website: website || null,
        address: address || null,
      })
      .eq("id", orgId)
      .select("id")
      .single()

    console.log("Update result:", { data, error })

    if (error) {
      console.error("Organization update error:", error)
      throw new Error(`Failed to update organization: ${error.message}`)
    }

    console.log("Organization updated successfully")
    return data
  } catch (error) {
    console.error("Error in updateBusinessStep2:", error)
    throw error
  }
}
