import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { customers, userId } = await request.json()

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: "Invalid customers data" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Add user_id to each customer
    const customersWithUserId = customers.map((customer) => ({
      ...customer,
      user_id: userId,
    }))

    const { data, error } = await supabase.from("customers").insert(customersWithUserId).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to import customers" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imported: data.length,
      customers: data,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const runtime = "nodejs"
