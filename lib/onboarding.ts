import { supabase } from "./supabase"

interface OnboardingData {
  businessName: string
  industry: string
  companySize: string
  businessType: string
  primaryGoals: string[]
  description: string
}

export async function completeOnboarding(data: OnboardingData) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("No authenticated user")
  }

  // Create or update organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .upsert({
      name: data.businessName,
      industry: data.industry,
      company_size: data.companySize,
      business_type: data.businessType,
      description: data.description,
      owner_id: user.id,
    })
    .select()
    .single()

  if (orgError) {
    throw orgError
  }

  // Update user profile
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name,
    onboarding_completed: true,
    primary_goals: data.primaryGoals,
  })

  if (profileError) {
    throw profileError
  }

  // Create membership
  const { error: membershipError } = await supabase.from("memberships").upsert({
    user_id: user.id,
    organization_id: org.id,
    role: "owner",
  })

  if (membershipError) {
    throw membershipError
  }

  return org
}
