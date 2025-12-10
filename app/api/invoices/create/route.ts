import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { customerId, lineItems } = body

    const { data: profile } = await supabase.from("profiles").select("default_org").eq("id", user.id).single()

    const orgId = profile?.default_org
    if (!orgId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 })
    }

    const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.quantity * item.unit_price, 0)
    const taxRate = 0.0825
    const taxAmount = subtotal * taxRate
    const totalAmount = subtotal + taxAmount

    const { data: invoice, error: insertError } = await supabase
      .from("invoices")
      .insert([
        {
          org_id: orgId,
          customer_id: customerId,
          created_by: user.id,
          title: `Invoice for Customer ${customerId}`,
          status: "draft",
          subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
      ])
      .select("*")
      .single()

    if (insertError) {
      console.error("Insert error:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    let paymentUrl = null

    if (stripeSecret) {
      try {
        const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" })
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: lineItems.map((item: any) => ({
            price_data: {
              currency: "usd",
              unit_amount: Math.round(item.unit_price * 100),
              product_data: { name: item.name },
            },
            quantity: item.quantity,
          })),
          success_url: `${req.nextUrl.origin}/dashboard?paid=success`,
          cancel_url: `${req.nextUrl.origin}/dashboard?paid=cancel`,
        })

        paymentUrl = session.url

        await supabase.from("invoices").update({ stripe_invoice_id: session.id, status: "sent" }).eq("id", invoice.id)
      } catch (stripeError) {
        console.error("Stripe error:", stripeError)
      }
    }

    return NextResponse.json({ invoice, paymentUrl }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
