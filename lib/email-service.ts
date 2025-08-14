// Email service using your existing SENDGRID_API_KEY
import sgMail from "@sendgrid/mail"

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM || "noreply@redfoxcrm.com",
    subject: "Welcome to RedFox CRM!",
    html: `
      <h1>Welcome ${firstName}!</h1>
      <p>Thank you for joining RedFox CRM. Your account is now active.</p>
      <p>Get started by logging into your dashboard.</p>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log("Welcome email sent successfully")
  } catch (error) {
    console.error("Error sending welcome email:", error)
  }
}

export async function sendInvoiceEmail(customerEmail: string, invoiceData: any) {
  const msg = {
    to: customerEmail,
    from: process.env.EMAIL_FROM || "noreply@redfoxcrm.com",
    subject: `Invoice #${invoiceData.id} from RedFox CRM`,
    html: `
      <h1>New Invoice</h1>
      <p>Amount: $${invoiceData.amount}</p>
      <p>Due Date: ${invoiceData.due_date}</p>
      <p>Please log in to view and pay your invoice.</p>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log("Invoice email sent successfully")
  } catch (error) {
    console.error("Error sending invoice email:", error)
  }
}
