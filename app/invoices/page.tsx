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
import { Search, Plus, Receipt, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
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
  const [orgId, setOrgId] = useState<string | null>(null)
  const [newInvoice, setNewInvoice] = useState({
    customer_id: "",
    title: "",
    description: "",
    subtotal: 0,
    tax_rate: 8.5,
    due_date: "",
  })

  const supabase = createClient()
  const { toast } = useToast()

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

      // Fetch invoices and customers in parallel
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

  const handleCreateInvoice = async () => {
    if (!orgId) {
      toast({ title: "Error", description: "No organization found", variant: "destructive" })
      return
    }

    if (!newInvoice.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const taxAmount = (newInvoice.subtotal * newInvoice.tax_rate) / 100
      const totalAmount = newInvoice.subtotal + taxAmount

      const { error } = await supabase.from("invoices").insert([
        {
          org_id: orgId,
          created_by: user.id,
          customer_id: newInvoice.customer_id || null,
          invoice_number: `INV-${Date.now()}`,
          title: newInvoice.title.trim(),
          description: newInvoice.description.trim() || null,
          subtotal: newInvoice.subtotal,
          tax_rate: newInvoice.tax_rate,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          amount_paid: 0,
          status: "draft",
          due_date: newInvoice.due_date || null,
        },
      ])

      if (error) throw error

      toast({ title: "Success", description: "Invoice created successfully" })
      setIsDialogOpen(false)
      setNewInvoice({ customer_id: "", title: "", description: "", subtotal: 0, tax_rate: 8.5, due_date: "" })
      loadData()
    } catch (error) {
      console.error("[v0] Error creating invoice:", error)
      toast({ title: "Error", description: "Failed to create invoice", variant: "destructive" })
    }
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
      viewed: "bg-yellow-500",
      paid: "bg-green-500",
      overdue: "bg-red-500",
      cancelled: "bg-gray-600",
    }
    return colors[status] || "bg-gray-500"
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0)
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.total_amount - inv.amount_paid), 0)

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
        {/* Header */}
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                    <Label>Title *</Label>
                    <Input
                      value={newInvoice.title}
                      onChange={(e) => setNewInvoice({ ...newInvoice, title: e.target.value })}
                      placeholder="Invoice title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subtotal ($)</Label>
                      <Input
                        type="number"
                        value={newInvoice.subtotal}
                        onChange={(e) =>
                          setNewInvoice({ ...newInvoice, subtotal: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
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
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newInvoice.due_date}
                      onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                    />
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${newInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax ({newInvoice.tax_rate}%):</span>
                      <span>${((newInvoice.subtotal * newInvoice.tax_rate) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>
                        ${(newInvoice.subtotal + (newInvoice.subtotal * newInvoice.tax_rate) / 100).toFixed(2)}
                      </span>
                    </div>
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

        {/* Stats */}
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

        {/* Invoices Table */}
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
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Due Date</th>
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
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusColor(inv.status)} text-white`}>{inv.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-4">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No invoices found. Create your first invoice!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
