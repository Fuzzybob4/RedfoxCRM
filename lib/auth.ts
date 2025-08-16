import { supabase } from "./supabase"

interface SignUpParams {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  companyName: string
  subscriptionType: string
  billingPeriod: string
  cost: number
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
}: SignUpParams) {
  try {
    console.log("Starting signup process for:", email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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
      console.error("Supabase signup error:", error)
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status,
          code: error.name || "signup_error",
          details: error,
        },
      }
    }

    if (data?.user) {
      console.log("User created successfully:", data.user.id)
      return {
        success: true,
        data: data.user,
        needsEmailConfirmation: !data.user.email_confirmed_at,
      }
    } else {
      console.warn("Sign up completed but no user data returned")
      return {
        success: false,
        error: {
          message: "Account creation completed but user data is missing. Please try logging in.",
          code: "no_user_data",
          details: data,
        },
      }
    }
  } catch (error) {
    console.error("Unexpected error in handleSignUp:", error)
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred during signup",
        code: error instanceof Error ? error.name : "unknown_error",
        details: error,
      },
    }
  }
}

export async function handleSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name || "signin_error",
        },
      }
    }

    return {
      success: true,
      data: data.user,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        code: "unknown_error",
      },
    }
  }
}
