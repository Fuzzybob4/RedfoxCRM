import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

async function parseCsv(file: File): Promise<any[]> {
  const text = await file.text()
  const lines = text.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim())
    const record: Record<string, any> = {}
    headers.forEach((header, i) => (record[header] = cols[i] ?? null))
    return record
  })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ req })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const form = await req.formData()
    const file = form.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const { data: profile } = await supabase.from("profiles").select("default_org").eq("id", user.id).single()

    const orgId = profile?.default_org
    if (!orgId) {
      return NextResponse.json({ error: "User has no organization" }, { status: 400 })
    }

    const records = await parseCsv(file)

    // Map CSV fields to your customers table columns
    const rows = records.map((r) => ({
      org_id: orgId,
      first_name: r.first_name || r["first name"] || "",
      last_name: r.last_name || r["last name"] || "",
      email: r.email || "",
      phone_number: r.phone_number || r.phone || r["phone number"] || "",
      address: r.address || "",
      city: r.city || "",
      state: r.state || "",
      zip: r.zip || r.zipcode || r["zip code"] || "",
      lead_status: r.lead_status || r.status || "new",
      customer_type: r.customer_type || r.type || "residential",
      created_by: user.id,
    }))

    const { error, count } = await supabase.from("customers").insert(rows).select("id", { count: "exact" })

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ inserted: count ?? rows.length }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
