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

export async function getServerSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting server session:", error)
      return null
    }

    return session
  } catch (error) {
    console.error("Error in getServerSession:", error)
    return null
  }
}

export async function getServerUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting server user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error in getServerUser:", error)
    return null
  }
}

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
