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
    // Update user profile with onboarding data
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      business_name: data.businessName,
      business_type: data.businessType,
      company_size: data.companySize,
      industry: data.industry,
      goals: data.goals,
      phone: data.contactInfo.phone,
      address: data.contactInfo.address,
      website: data.contactInfo.website,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      throw profileError
    }

    return { success: true }
  } catch (error) {
    console.error("Error completing onboarding:", error)
    throw error
  }
}

export async function createOrganization(name: string, plan: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("organizations")
      .insert({
        name,
        plan,
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error creating organization:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateBusinessInfo(businessName: string, companySize: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        company_size: companySize,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating business info:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateContactInfo(contactData: {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        phone: contactData.phone,
        address: contactData.address,
        city: contactData.city,
        state: contactData.state,
        zip_code: contactData.zipCode,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating contact info:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
