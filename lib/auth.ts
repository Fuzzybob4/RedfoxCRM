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

async function handleSignUp({
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
    // Step 1: Sign up the user
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
      console.error("Signup Error:", error)
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status,
          code: (error as any).code || "unknown",
          details: error,
        },
      }
    }

    if (data?.user) {
      // Step 2: Insert user data into the profiles table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: data.user.email,
          phone_number: phoneNumber,
          company_name: companyName,
          subscription_type: subscriptionType,
          billing_period: billingPeriod,
          cost: cost,
        },
      ])

      if (profileError) {
        console.error("Error inserting profile:", profileError)
        return {
          success: false,
          error: {
            message: "Failed to create user profile",
            details: profileError,
          },
        }
      }

      console.log("User signed up and profile created:", data.user)
      return { success: true, data: data.user }
    } else {
      console.warn("Sign up successful, but no user data returned")
      return {
        success: false,
        error: {
          message: "Sign up successful, but no user data returned",
          code: "no_user_data",
          details: data,
        },
      }
    }
  } catch (error) {
    console.error("Error in handleSignUp:", error)
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An unknown error occurred",
        code: error instanceof Error ? error.name : "unknown_error",
        details: JSON.stringify(error, null, 2),
      },
    }
  }
}

export { handleSignUp }

