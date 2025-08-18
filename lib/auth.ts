import { supabase } from "./supabase"

export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  return { data, error }
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  return { data, error }
}

// Add the missing handleSignUp function
export async function handleSignUp({
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  companyName,
  subscriptionType,
  billingPeriod,
  cost,
}: {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  companyName: string
  subscriptionType: string
  billingPeriod: string
  cost: number
}) {
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          company_name: companyName,
          subscription_type: subscriptionType,
          billing_period: billingPeriod,
          cost: cost,
        },
      },
    })

    if (error) {
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
