"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createInvoicePaymentSession(invoiceId: string) {
  const supabase = await createClient()

  // Fetch invoice details
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(`
      *,
      customers (
        first_name,
        last_name,
        email
      )
    `)
    .eq("id", invoiceId)
    .single()

  if (invoiceError || !invoice) {
    throw new Error("Invoice not found")
  }

  // Fetch line items
  const { data: lineItems, error: lineItemsError } = await supabase
    .from("invoice_line_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("sort_order")

  if (lineItemsError) {
    throw new Error("Failed to fetch line items")
  }

  const amountToCharge = invoice.balance_due || invoice.total_amount

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items:
      lineItems && lineItems.length > 0
        ? lineItems.map((item) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.description,
              },
              unit_amount: Math.round(Number(item.unit_price) * 100), // Convert to cents
            },
            quantity: Number(item.quantity),
          }))
        : [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: invoice.title || `Invoice ${invoice.invoice_number}`,
                  description: invoice.description || undefined,
                },
                unit_amount: Math.round(Number(amountToCharge) * 100), // Convert to cents
              },
              quantity: 1,
            },
          ],
    mode: "payment",
    customer_email: invoice.customers?.email,
    metadata: {
      invoice_id: invoiceId,
      invoice_number: invoice.invoice_number,
    },
  })

  // Update invoice with Stripe payment intent
  await supabase
    .from("invoices")
    .update({
      stripe_payment_intent_id: session.payment_intent as string,
      payment_method: "stripe",
    })
    .eq("id", invoiceId)

  return session.client_secret
}

export async function markInvoicePaid(invoiceId: string, paymentMethod = "cash", amountPaid?: number) {
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from("invoices")
    .select("total_amount, deposit_amount, amount_paid")
    .eq("id", invoiceId)
    .single()

  if (!invoice) throw new Error("Invoice not found")

  const totalPaid = Number(invoice.amount_paid || 0) + (amountPaid || Number(invoice.total_amount))
  const balanceDue = Number(invoice.total_amount) - totalPaid

  await supabase
    .from("invoices")
    .update({
      amount_paid: totalPaid,
      balance_due: balanceDue,
      status: balanceDue <= 0 ? "paid" : "partial",
      paid_date: balanceDue <= 0 ? new Date().toISOString() : null,
      payment_method: paymentMethod,
    })
    .eq("id", invoiceId)
}
