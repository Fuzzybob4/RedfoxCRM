"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadInvoices()
    loadCustomers()
  }, [])

  async function loadInvoices() {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, customers ( first_name, last_name )")
      .order("created_at", { ascending: false })
    if (!error) setInvoices(data ?? [])
  }

  async function loadCustomers() {
    const { data, error } = await supabase.from("customers").select("id, first_name, last_name").limit(10)
    if (!error) setCustomers(data ?? [])
  }

  async function createSampleInvoice() {
    if (customers.length === 0) {
      toast({
        title: "Error",
        description: "No customers found. Please add customers first.",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      const res = await fetch("/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customers[0].id,
          lineItems: [
            { name: "Holiday Lighting Installation", quantity: 1, unit_price: 500.0 },
            { name: "LED Light Strings", quantity: 10, unit_price: 25.0 },
          ],
        }),
      })
      const json = await res.json()

      if (!res.ok) {
        toast({
          title: "Error",
          description: json.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Invoice created successfully",
        })
        loadInvoices()
        if (json.paymentUrl) {
          window.open(json.paymentUrl, "_blank")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Create and manage your invoices</p>
        </div>
        <Button onClick={createSampleInvoice} disabled={creating}>
          {creating ? "Creating..." : "Create Sample Invoice"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter((i) => i.status === "draft").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter((i) => i.status === "sent").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter((i) => i.status === "paid").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Invoice #</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b">
                    <td className="py-2">#{inv.id}</td>
                    <td className="py-2">
                      {inv.customers?.first_name} {inv.customers?.last_name}
                    </td>
                    <td className="py-2">${inv.total_amount?.toFixed(2)}</td>
                    <td className="py-2">
                      <Badge className={getStatusColor(inv.status)}>{inv.status}</Badge>
                    </td>
                    <td className="py-2">{new Date(inv.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No invoices found. Create your first invoice to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
