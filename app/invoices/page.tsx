"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, DollarSign, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Invoice {
  id: string
  title: string
  status: string
  subtotal: number
  tax_amount: number
  total_amount: number
  due_date: string
  created_at: string
  stripe_invoice_id?: string
  customers?: {
    first_name: string
    last_name: string
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customers (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading invoices:", error)
        toast({
          title: "Error",
          description: "Failed to load invoices",
          variant: "destructive",
        })
      } else {
        setInvoices(data || [])
      }
    } catch (error) {
      console.error("Error loading invoices:", error)
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function createSampleInvoice() {
    try {
      setCreating(true)

      // Get the first customer for demo
      const { data: customers, error: customerError } = await supabase.from("customers").select("id").limit(1)

      if (customerError || !customers || customers.length === 0) {
        toast({
          title: "Error",
          description: "No customers found. Please add a customer first.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/invoices/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customers[0].id,
          lineItems: [
            { name: "Professional Service", quantity: 1, unit_price: 200.0 },
            { name: "Materials", quantity: 2, unit_price: 50.0 },
          ],
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create invoice")
      }

      toast({
        title: "Success",
        description: "Invoice created successfully!",
      })

      loadInvoices()

      // Open payment URL if available
      if (result.paymentUrl) {
        window.open(result.paymentUrl, "_blank")
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invoice",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Invoices
          </h1>
          <p className="text-slate-600 mt-2">Create and manage your invoices with integrated payment processing</p>
        </div>
        <Button onClick={createSampleInvoice} disabled={creating} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          {creating ? "Creating..." : "Create Invoice"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{invoices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(
                invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {invoices.filter((inv) => inv.status === "sent").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Overdue</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {invoices.filter((inv) => inv.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>All your invoices and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500">Loading invoices...</div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No invoices yet</h3>
              <p className="text-slate-500 mb-4">Create your first invoice to start getting paid</p>
              <Button onClick={createSampleInvoice} disabled={creating} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">#{invoice.id}</TableCell>
                      <TableCell>
                        {invoice.customers
                          ? `${invoice.customers.first_name} ${invoice.customers.last_name}`
                          : "Unknown Customer"}
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.total_amount || 0)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status || "Draft"}</Badge>
                      </TableCell>
                      <TableCell>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "—"}</TableCell>
                      <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {invoice.stripe_invoice_id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // This would open the Stripe payment link
                              toast({
                                title: "Payment Link",
                                description: "Payment link functionality would open here",
                              })
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
