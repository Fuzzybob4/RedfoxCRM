"use client"

import { supabase } from "@/lib/supabase"

/** Make sure we're logged in and return the user id (auth.uid on the DB side). */
async function getUserOrThrow() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  if (!user) throw new Error("You must be signed in before creating a business.")
  return user.id
}

/** Optional: combine address parts into a single string column if your DB only has `organizations.address` */
export function composeAddress(parts: {
  line1?: string
  line2?: string
  city?: string
  state?: string
  zip?: string
}) {
  const { line1, line2, city, state, zip } = parts
  const cityState = city && state ? `${city}, ${state}` : city || state || ""
  const arr = [line1, line2, cityState, zip].filter(Boolean)
  return arr.length ? arr.join(" · ") : null
}

/**
 * Path A — use the RPC (recommended).
 * Requires the SQL function `public.provision_first_org(name, plan, address, phone, email, website)`.
 */
export async function createBusinessViaRPC(input: {
  name: string
  plan?: "free" | "pro" | "business" | "enterprise"
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
}) {
  await getUserOrThrow() // ensures we're authenticated (otherwise RLS will block)

  const { data, error } = await supabase.rpc("provision_first_org", {
    p_name: input.name,
    p_plan: input.plan ?? "pro",
    p_address: input.address ?? null,
    p_phone: input.phone ?? null,
    p_email: input.email ?? null,
    p_website: input.website ?? null,
  })

  if (error) {
    // This is the *real* error from Postgres/RLS
    console.error("provision_first_org error:", error)
    throw new Error(error.message ?? "Failed to create organization")
  }

  // data is the new org id (uuid)
  return data as string
}

/**
 * Path B — direct INSERT (only use if you don't use the RPC).
 * IMPORTANT: must set owner_id = current user id to pass RLS.
 */
export async function createBusinessDirect(input: {
  name: string
  plan?: "free" | "pro" | "business" | "enterprise"
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
}) {
  const userId = await getUserOrThrow() // <- critical for owner_id

  const { data, error } = await supabase
    .from("organizations")
    .insert([
      {
        name: input.name,
        plan: input.plan ?? "pro",
        owner_id: userId, // <- REQUIRED by RLS policy
        address: input.address ?? null, // add/remove fields to match your schema
        phone: input.phone ?? null,
        email: input.email ?? null,
        website: input.website ?? null,
      },
    ])
    .select("id")
    .single()

  if (error) {
    console.error("organizations.insert error:", error)
    throw new Error(error.message ?? "Failed to create organization")
  }

  // Create owner membership
  const { error: membershipError } = await supabase.from("memberships").insert([
    {
      org_id: data.id,
      user_id: userId,
      role: "owner",
      is_active: true,
    },
  ])

  if (membershipError) {
    console.error("membership creation error:", membershipError)
    throw new Error("Failed to create membership: " + membershipError.message)
  }

  // Set default org
  const { error: profileError } = await supabase.from("profiles").update({ default_org: data.id }).eq("id", userId)

  if (profileError) {
    console.warn("Failed to set default org:", profileError)
    // Don't fail the whole process for this
  }

  return data.id as string
}

/** One public entry — choose RPC first, fallback to direct for debugging */
export async function createBusiness(input: {
  name: string
  plan?: "free" | "pro" | "business" | "enterprise"
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
}) {
  try {
    return await createBusinessViaRPC(input)
  } catch (e) {
    // If RPC is misconfigured (signature, RLS, etc.), try direct insert to see clearer errors
    console.warn("RPC failed, trying direct insert fallback. Reason:", (e as any)?.message)
    return await createBusinessDirect(input)
  }
}
