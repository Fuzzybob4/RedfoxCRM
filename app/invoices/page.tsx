"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Receipt, DollarSign, Trash2, Send, Eye, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createInvoicePaymentSession, markInvoicePaid } from "@/app/actions/stripe-invoice"
import { DashboardSidebar } from "@/app/components/dashboard-sidebar"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
}

interface LineItem {
  id?: string
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

interface Invoice {
  id: string
  invoice_number: string
  title: string
  description?: string
  status: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total_amount: number
  amount_paid: number
  deposit_amount?: number
  balance_due?: number
  due_date?: string
  paid_date?: string
  created_at: string
  customer?: Customer
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0, line_total: 0 },
  ])
  const [newInvoice, setNewInvoice] = useState({
    customer_id: "",
    title: "",
    description: "",
    tax_rate: 8.5,
    due_date: "",
    deposit_amount: 0,
  })

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [selectedInvoiceLineItems, setSelectedInvoiceLineItems] = useState<LineItem[]>([])
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [sendEmail, setSendEmail] = useState("")
  const [sendMessage, setSendMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [isManualPaymentDialogOpen, setIsManualPaymentDialogOpen] = useState(false)
  const [manualPaymentAmount, setManualPaymentAmount] = useState("")
  const [manualPaymentMethod, setManualPaymentMethod] = useState("cash")

  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (!membership?.org_id) {
        setIsLoading(false)
        return
      }

      setOrgId(membership.org_id)

      const [invoicesResult, customersResult] = await Promise.all([
        supabase
          .from("invoices")
          .select(`*, customer:customers(id, first_name, last_name, email)`)
          .eq("org_id", membership.org_id)
          .order("created_at", { ascending: false }),
        supabase.from("customers").select("id, first_name, last_name, email").eq("org_id", membership.org_id),
      ])

      if (invoicesResult.error) throw invoicesResult.error
      if (customersResult.error) throw customersResult.error

      setInvoices(invoicesResult.data || [])
      setCustomers(customersResult.data || [])
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({ title: "Error", description: "Failed to load invoices", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unit_price: 0, line_total: 0 }])
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index))
    }
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    if (field === "quantity" || field === "unit_price") {
      updated[index].line_total = updated[index].quantity * updated[index].unit_price
    }
    setLineItems(updated)
  }

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0)
    const taxAmount = (subtotal * newInvoice.tax_rate) / 100
    const totalAmount = subtotal + taxAmount
    const balanceDue = totalAmount - newInvoice.deposit_amount
    return { subtotal, taxAmount, totalAmount, balanceDue }
  }

  const handleCreateInvoice = async () => {
    if (!orgId) {
      toast({ title: "Error", description: "No organization found", variant: "destructive" })
      return
    }

    if (!newInvoice.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }

    const validLineItems = lineItems.filter((item) => item.description.trim() && item.unit_price > 0)
    if (validLineItems.length === 0) {
      toast({ title: "Error", description: "Add at least one line item", variant: "destructive" })
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { subtotal, taxAmount, totalAmount, balanceDue } = calculateTotals()

      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert([
          {
            org_id: orgId,
            created_by: user.id,
            customer_id: newInvoice.customer_id || null,
            invoice_number: `INV-${Date.now()}`,
            title: newInvoice.title.trim(),
            description: newInvoice.description.trim() || null,
            subtotal,
            tax_rate: newInvoice.tax_rate,
            tax_amount: taxAmount,
            total_amount: totalAmount,
            deposit_amount: newInvoice.deposit_amount,
            amount_paid: newInvoice.deposit_amount,
            balance_due: balanceDue,
            status: newInvoice.deposit_amount >= totalAmount ? "paid" : "draft",
            due_date: newInvoice.due_date || null,
          },
        ])
        .select()
        .single()

      if (invoiceError) throw invoiceError

      const lineItemsToInsert = validLineItems.map((item, index) => ({
        invoice_id: invoiceData.id,
        org_id: orgId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        sort_order: index,
      }))

      const { error: lineItemsError } = await supabase.from("invoice_line_items").insert(lineItemsToInsert)

      if (lineItemsError) throw lineItemsError

      toast({ title: "Success", description: "Invoice created successfully" })
      setIsDialogOpen(false)
      setNewInvoice({ customer_id: "", title: "", description: "", tax_rate: 8.5, due_date: "", deposit_amount: 0 })
      setLineItems([{ description: "", quantity: 1, unit_price: 0, line_total: 0 }])
      loadData()
    } catch (error) {
      console.error("[v0] Error creating invoice:", error)
      toast({ title: "Error", description: "Failed to create invoice", variant: "destructive" })
    }
  }

  const handleViewInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice)

    // Fetch line items for this invoice
    const { data: items, error } = await supabase
      .from("invoice_line_items")
      .select("*")
      .eq("invoice_id", invoice.id)
      .order("sort_order")

    if (!error && items) {
      setSelectedInvoiceLineItems(items)
    }

    setIsViewDialogOpen(true)
  }

  const handleSendInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setSendEmail(invoice.customer?.email || "")
    setSendMessage(
      `Dear ${invoice.customer?.first_name || "Customer"},\n\nPlease find attached invoice #${invoice.invoice_number} for ${invoice.title}.\n\nTotal Amount: $${invoice.total_amount.toFixed(2)}\nBalance Due: $${(invoice.balance_due || 0).toFixed(2)}\n\nThank you for your business!`,
    )
    setIsSendDialogOpen(true)
  }

  const sendInvoiceEmail = async () => {
    if (!selectedInvoice || !sendEmail) {
      toast({ title: "Error", description: "Email address is required", variant: "destructive" })
      return
    }

    setIsSending(true)
    try {
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          email: sendEmail,
          message: sendMessage,
        }),
      })

      if (!response.ok) throw new Error("Failed to send")

      // Update status to sent if it was draft
      if (selectedInvoice.status === "draft") {
        await supabase.from("invoices").update({ status: "sent" }).eq("id", selectedInvoice.id)
      }

      toast({ title: "Success", description: "Invoice sent successfully" })
      setIsSendDialogOpen(false)
      loadData()
    } catch (error) {
      console.error("[v0] Error sending invoice:", error)
      toast({ title: "Error", description: "Failed to send invoice", variant: "destructive" })
    } finally {
      setIsSending(false)
    }
  }

  const handleChangeStatus = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setNewStatus(invoice.status)
    setIsStatusDialogOpen(true)
  }

  const updateInvoiceStatus = async () => {
    if (!selectedInvoice) return

    try {
      const { error } = await supabase.from("invoices").update({ status: newStatus }).eq("id", selectedInvoice.id)

      if (error) throw error

      toast({ title: "Success", description: "Status updated successfully" })
      setIsStatusDialogOpen(false)
      loadData()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
    }
  }

  const handleManualPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setManualPaymentAmount((invoice.balance_due || 0).toString())
    setManualPaymentMethod("cash")
    setIsManualPaymentDialogOpen(true)
  }

  const recordManualPayment = async () => {
    if (!selectedInvoice) return

    const amount = Number.parseFloat(manualPaymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" })
      return
    }

    try {
      await markInvoicePaid(selectedInvoice.id, manualPaymentMethod, amount)
      toast({ title: "Success", description: "Payment recorded successfully" })
      setIsManualPaymentDialogOpen(false)
      loadData()
    } catch (error) {
      console.error("[v0] Error recording payment:", error)
      toast({ title: "Error", description: "Failed to record payment", variant: "destructive" })
    }
  }

  const handlePayInvoice = (invoiceId: string) => {
    setSelectedInvoiceForPayment(invoiceId)
    setIsPaymentDialogOpen(true)
  }

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${inv.customer?.first_name} ${inv.customer?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500",
      sent: "bg-blue-500",
      partial: "bg-yellow-500",
      paid: "bg-green-500",
      overdue: "bg-red-500",
      cancelled: "bg-gray-600",
    }
    return colors[status] || "bg-gray-500"
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0)
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.balance_due || 0), 0)

  const { subtotal, taxAmount, totalAmount, balanceDue } = calculateTotals()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading invoices...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1 lg:ml-64">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Invoices</h1>
                <p className="text-muted-foreground">Manage your invoices and payments</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      New Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Customer (Optional)</Label>
                          <Select
                            value={newInvoice.customer_id}
                            onValueChange={(v) => setNewInvoice({ ...newInvoice, customer_id: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.first_name} {c.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Input
                            type="date"
                            value={newInvoice.due_date}
                            onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Invoice Title *</Label>
                        <Input
                          value={newInvoice.title}
                          onChange={(e) => setNewInvoice({ ...newInvoice, title: e.target.value })}
                          placeholder="e.g., Roof Repair Service"
                        />
                      </div>
                      <div>
                        <Label>Description / Notes</Label>
                        <Textarea
                          value={newInvoice.description}
                          onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                          rows={2}
                          placeholder="Additional details about the work..."
                        />
                      </div>

                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-semibold">Line Items</Label>
                          <Button onClick={addLineItem} size="sm" variant="outline">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Item
                          </Button>
                        </div>
                        {lineItems.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-5">
                              <Label className="text-xs">Description</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => updateLineItem(index, "description", e.target.value)}
                                placeholder="Service or product"
                                className="text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                step="0.01"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateLineItem(index, "quantity", Number.parseFloat(e.target.value) || 0)
                                }
                                className="text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs">Unit Price</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) =>
                                  updateLineItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)
                                }
                                className="text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs">Total</Label>
                              <Input value={`$${item.line_total.toFixed(2)}`} disabled className="text-sm bg-muted" />
                            </div>
                            <div className="col-span-1 flex items-end">
                              <Button
                                onClick={() => removeLineItem(index)}
                                size="sm"
                                variant="ghost"
                                disabled={lineItems.length === 1}
                                className="h-9"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tax Rate (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={newInvoice.tax_rate}
                            onChange={(e) =>
                              setNewInvoice({ ...newInvoice, tax_rate: Number.parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div>
                          <Label>Deposit Amount ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newInvoice.deposit_amount}
                            onChange={(e) =>
                              setNewInvoice({ ...newInvoice, deposit_amount: Number.parseFloat(e.target.value) || 0 })
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax ({newInvoice.tax_rate}%):</span>
                          <span className="font-medium">${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                          <span>Total Amount:</span>
                          <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        {newInvoice.deposit_amount > 0 && (
                          <>
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Deposit Paid:</span>
                              <span className="font-medium">-${newInvoice.deposit_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base border-t pt-2">
                              <span>Balance Due:</span>
                              <span className="text-orange-600">${balanceDue.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateInvoice}>Create Invoice</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Receipt className="w-4 h-4 mr-2" />
                    Total Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{invoices.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Revenue Collected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Outstanding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Invoice #</th>
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Title</th>
                        <th className="text-left py-3 px-4 font-medium">Total</th>
                        <th className="text-left py-3 px-4 font-medium">Paid</th>
                        <th className="text-left py-3 px-4 font-medium">Balance</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleViewInvoice(inv)}
                              className="font-medium text-primary hover:underline"
                            >
                              {inv.invoice_number}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            {inv.customer ? `${inv.customer.first_name} ${inv.customer.last_name}` : "-"}
                          </td>
                          <td className="py-4 px-4">{inv.title}</td>
                          <td className="py-4 px-4">${inv.total_amount.toLocaleString()}</td>
                          <td className="py-4 px-4 text-green-600">${(inv.amount_paid || 0).toLocaleString()}</td>
                          <td className="py-4 px-4 text-orange-600 font-semibold">
                            ${(inv.balance_due || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <button onClick={() => handleChangeStatus(inv)}>
                              <Badge
                                className={`${getStatusColor(inv.status)} text-white cursor-pointer hover:opacity-80`}
                              >
                                {inv.status.toUpperCase()}
                              </Badge>
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleViewInvoice(inv)}
                                size="sm"
                                variant="ghost"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleSendInvoice(inv)}
                                size="sm"
                                variant="ghost"
                                title="Send Invoice"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                              {inv.status !== "paid" && inv.balance_due && inv.balance_due > 0 && (
                                <>
                                  <Button
                                    onClick={() => handleManualPayment(inv)}
                                    size="sm"
                                    variant="ghost"
                                    title="Record Payment"
                                  >
                                    <DollarSign className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => handlePayInvoice(inv.id)}
                                    size="sm"
                                    variant="outline"
                                    title="Pay with Stripe"
                                  >
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    Pay
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredInvoices.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-muted-foreground">
                            No invoices found. Create your first invoice!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Invoice Details - {selectedInvoice?.invoice_number}</DialogTitle>
                </DialogHeader>
                {selectedInvoice && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Customer</Label>
                        <p className="font-medium">
                          {selectedInvoice.customer
                            ? `${selectedInvoice.customer.first_name} ${selectedInvoice.customer.last_name}`
                            : "No customer assigned"}
                        </p>
                        {selectedInvoice.customer?.email && (
                          <p className="text-sm text-muted-foreground">{selectedInvoice.customer.email}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="mt-1">
                          <Badge className={`${getStatusColor(selectedInvoice.status)} text-white`}>
                            {selectedInvoice.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Title</Label>
                      <p className="font-medium">{selectedInvoice.title}</p>
                    </div>

                    {selectedInvoice.description && (
                      <div>
                        <Label className="text-muted-foreground">Description</Label>
                        <p>{selectedInvoice.description}</p>
                      </div>
                    )}

                    <div>
                      <Label className="text-muted-foreground mb-2 block">Line Items</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left py-2 px-3 text-sm">Description</th>
                              <th className="text-right py-2 px-3 text-sm">Qty</th>
                              <th className="text-right py-2 px-3 text-sm">Unit Price</th>
                              <th className="text-right py-2 px-3 text-sm">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedInvoiceLineItems.map((item, index) => (
                              <tr key={index} className="border-t">
                                <td className="py-2 px-3">{item.description}</td>
                                <td className="py-2 px-3 text-right">{item.quantity}</td>
                                <td className="py-2 px-3 text-right">${Number(item.unit_price).toFixed(2)}</td>
                                <td className="py-2 px-3 text-right">${Number(item.line_total).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${Number(selectedInvoice.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax ({selectedInvoice.tax_rate}%):</span>
                        <span>${Number(selectedInvoice.tax_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>${Number(selectedInvoice.total_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Amount Paid:</span>
                        <span>-${Number(selectedInvoice.amount_paid || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-orange-600 border-t pt-2">
                        <span>Balance Due:</span>
                        <span>${Number(selectedInvoice.balance_due || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          setIsViewDialogOpen(false)
                          handleSendInvoice(selectedInvoice)
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Invoice
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Send Invoice #{selectedInvoice?.invoice_number}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Recipient Email *</Label>
                    <Input
                      type="email"
                      value={sendEmail}
                      onChange={(e) => setSendEmail(e.target.value)}
                      placeholder="customer@email.com"
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} rows={6} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={sendInvoiceEmail} disabled={isSending}>
                      {isSending ? "Sending..." : "Send Invoice"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Change Invoice Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={updateInvoiceStatus}>Update Status</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isManualPaymentDialogOpen} onOpenChange={setIsManualPaymentDialogOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Payment Amount ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={manualPaymentAmount}
                      onChange={(e) => setManualPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={manualPaymentMethod} onValueChange={setManualPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsManualPaymentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={recordManualPayment}>Record Payment</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Stripe Payment Dialog */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Pay Invoice</DialogTitle>
                </DialogHeader>
                {selectedInvoiceForPayment && (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret: () => createInvoicePaymentSession(selectedInvoiceForPayment) }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
