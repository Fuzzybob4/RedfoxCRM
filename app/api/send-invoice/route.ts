import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import sgMail from "@sendgrid/mail"

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { invoiceId, email, message } = await request.json()

    if (!invoiceId || !email) {
      return NextResponse.json({ error: "Invoice ID and email are required" }, { status: 400 })
    }

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        *,
        customers (first_name, last_name, email)
      `)
      .eq("id", invoiceId)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Fetch line items
    const { data: lineItems } = await supabase
      .from("invoice_line_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("sort_order")

    // Fetch business profile for branding
    const { data: membership } = await supabase
      .from("user_memberships")
      .select("org_id")
      .eq("user_id", user.id)
      .single()

    let businessName = "RedFox CRM"
    if (membership?.org_id) {
      const { data: business } = await supabase
        .from("business_profiles")
        .select("business_name")
        .eq("org_id", membership.org_id)
        .single()
      if (business?.business_name) {
        businessName = business.business_name
      }
    }

    // Build line items HTML
    const lineItemsHtml =
      lineItems && lineItems.length > 0
        ? lineItems
            .map(
              (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.unit_price).toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.line_total).toFixed(2)}</td>
        </tr>
      `,
            )
            .join("")
        : ""

    // Build email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">${businessName}</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Invoice #${invoice.invoice_number}</h2>
          
          <p style="white-space: pre-wrap;">${message}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${invoice.title}</h3>
            ${invoice.description ? `<p>${invoice.description}</p>` : ""}
          </div>
          
          ${
            lineItemsHtml
              ? `
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; text-align: left;">Description</th>
                <th style="padding: 8px; text-align: right;">Qty</th>
                <th style="padding: 8px; text-align: right;">Unit Price</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
          </table>
          `
              : ""
          }
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span>$${Number(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Tax (${invoice.tax_rate}%):</span>
              <span>$${Number(invoice.tax_amount).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px;">
              <span>Total:</span>
              <span>$${Number(invoice.total_amount).toFixed(2)}</span>
            </div>
            ${
              invoice.amount_paid > 0
                ? `
            <div style="display: flex; justify-content: space-between; color: #16a34a; margin-top: 8px;">
              <span>Amount Paid:</span>
              <span>-$${Number(invoice.amount_paid).toFixed(2)}</span>
            </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #f97316; font-size: 18px; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px;">
              <span>Balance Due:</span>
              <span>$${Number(invoice.balance_due || invoice.total_amount).toFixed(2)}</span>
            </div>
          </div>
          
          ${invoice.due_date ? `<p style="margin-top: 20px;"><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>` : ""}
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>Thank you for your business!</p>
          <p>Powered by ${businessName}</p>
        </div>
      </div>
    `

    // Send email
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || "noreply@redfoxcrm.com",
      subject: `Invoice #${invoice.invoice_number} from ${businessName}`,
      html: emailHtml,
    }

    await sgMail.send(msg)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending invoice:", error)
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 })
  }
}
