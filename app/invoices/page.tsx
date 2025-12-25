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
import { Search, Plus, Receipt, DollarSign, Trash2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createInvoicePaymentSession } from "@/app/actions/stripe-invoice"

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
    // Calculate line total
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
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

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
                            onChange={(e) => updateLineItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
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
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <td className="py-4 px-4 font-medium">{inv.invoice_number}</td>
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
                      <Badge className={`${getStatusColor(inv.status)} text-white`}>{inv.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      {inv.status !== "paid" && inv.balance_due && inv.balance_due > 0 && (
                        <Button onClick={() => handlePayInvoice(inv.id)} size="sm" variant="outline">
                          Pay Now
                        </Button>
                      )}
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
          </CardContent>
        </Card>

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
  )
}
