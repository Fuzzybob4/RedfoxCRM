import { supabase } from "./supabase"

interface OnboardingData {
  businessName: string
  businessType: string
  companySize: string
  industry: string
  goals: string[]
  contactInfo: {
    phone: string
    address: string
    website: string
  }
}

export async function completeOnboarding(userId: string, data: OnboardingData) {
  try {
    // First, create or update the organization
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .upsert({
        name: data.businessName,
        type: data.businessType,
        size: data.companySize,
        industry: data.industry,
        phone: data.contactInfo.phone,
        address: data.contactInfo.address,
        website: data.contactInfo.website,
        owner_id: userId,
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Update the user's profile
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      onboarding_completed: true,
      goals: data.goals,
      organization_id: orgData.id,
    })

    if (profileError) throw profileError

    // Create membership record
    const { error: membershipError } = await supabase.from("memberships").upsert({
      user_id: userId,
      organization_id: orgData.id,
      role: "owner",
    })

    if (membershipError) throw membershipError

    return { success: true, organizationId: orgData.id }
  } catch (error) {
    console.error("Error completing onboarding:", error)
    throw error
  }
}
