import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customers } = body

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: "Invalid customers data" }, { status: 400 })
    }

    // Validate customer data
    const validCustomers = customers.filter((customer) => customer.name && customer.email)

    if (validCustomers.length === 0) {
      return NextResponse.json({ error: "No valid customers to import" }, { status: 400 })
    }

    // Import customers
    const { data: importedCustomers, error } = await supabase
      .from("customers")
      .insert(
        validCustomers.map((customer) => ({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || null,
          address: customer.address || null,
          company: customer.company || null,
          created_at: new Date().toISOString(),
        })),
      )
      .select()

    if (error) {
      console.error("Error importing customers:", error)
      return NextResponse.json({ error: "Failed to import customers" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: `Successfully imported ${importedCustomers.length} customers`,
        customers: importedCustomers,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in customer import:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
