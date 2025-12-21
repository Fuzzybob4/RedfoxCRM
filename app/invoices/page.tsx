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
import { Search, Plus, Receipt, DollarSign, Calendar, Eye, Send, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
  customer?: {
    first_name: string
    last_name: string
    email?: string
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
    fetchInvoices()
    fetchCustomers()
  }, [])

  const fetchInvoices = async () => {
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

      if (!membership?.org_id) return

      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(first_name, last_name, email)
        `)
        .eq("org_id", membership.org_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setInvoices(data || [])
    } catch (error) {
      console.error("Error fetching invoices:", error)
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomers = async () => {
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

      if (!membership?.org_id) return

      const { data, error } = await supabase
        .from("customers")
        .select("id, first_name, last_name, email")
        .eq("org_id", membership.org_id)
        .eq("is_active", true)

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
  }

  const handleCreateInvoice = async () => {
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
        toast({
          title: "Error",
          description: "No organization found",
          variant: "destructive",
        })
        return
      }

      const taxAmount = (newInvoice.subtotal * newInvoice.tax_rate) / 100
      const totalAmount = newInvoice.subtotal + taxAmount

      const { error } = await supabase.from("invoices").insert([
        {
          ...newInvoice,
          org_id: membership.org_id,
          created_by: user.id,
          invoice_number: `INV-${Date.now()}`,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          amount_paid: 0,
          status: "draft",
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Invoice created successfully",
      })

      setIsDialogOpen(false)
      setNewInvoice({
        customer_id: "",
        title: "",
        description: "",
        subtotal: 0,
        tax_rate: 8.5,
        due_date: "",
      })
      fetchInvoices()
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      })
    }
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${invoice.customer?.first_name} ${invoice.customer?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-500",
      sent: "bg-blue-500",
      viewed: "bg-yellow-500",
      paid: "bg-green-500",
      overdue: "bg-red-500",
      cancelled: "bg-gray-600",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount_paid, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1f2c] flex items-center justify-center">
        <div className="text-white">Loading invoices...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1f2c] text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#272e3f] min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">RedFox CRM</h1>
            <p className="text-gray-400 text-sm">Acme Landscaping</p>
          </div>

          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </a>
            <a
              href="/customers"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>👥</span>
              <span>Customers</span>
            </a>
            <a
              href="/estimates"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>📋</span>
              <span>Estimates</span>
            </a>
            <a href="/invoices" className="flex items-center space-x-3 text-white bg-[#1a1f2c] p-3 rounded-lg">
              <Receipt className="w-5 h-5" />
              <span>Invoices</span>
            </a>
            <a
              href="/projects"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>🏗️</span>
              <span>Projects</span>
            </a>
            <a
              href="/settings"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#272e3f] border-gray-600 text-white placeholder-gray-400 w-80"
                />
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#272e3f] border-gray-600 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select
                      value={newInvoice.customer_id}
                      onValueChange={(value) => setNewInvoice({ ...newInvoice, customer_id: value })}
                    >
                      <SelectTrigger className="bg-[#1a1f2c] border-gray-600 text-white">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#272e3f] border-gray-600">
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.first_name} {customer.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newInvoice.title}
                      onChange={(e) => setNewInvoice({ ...newInvoice, title: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                      placeholder="Invoice title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                      className="bg-[#272e3f] border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subtotal">Subtotal ($)</Label>
                      <Input
                        id="subtotal"
                        type="number"
                        value={newInvoice.subtotal}
                        onChange={(e) =>
                          setNewInvoice({ ...newInvoice, subtotal: Number.parseFloat(e.target.value) || 0 })
                        }
                        className="bg-[#1a1f2c] border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                      <Input
                        id="tax_rate"
                        type="number"
                        step="0.1"
                        value={newInvoice.tax_rate}
                        onChange={(e) =>
                          setNewInvoice({ ...newInvoice, tax_rate: Number.parseFloat(e.target.value) || 0 })
                        }
                        className="bg-[#1a1f2c] border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newInvoice.due_date}
                      onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div className="bg-[#1a1f2c] p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${newInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax ({newInvoice.tax_rate}%):</span>
                      <span>${((newInvoice.subtotal * newInvoice.tax_rate) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2 mt-2">
                      <span>Total:</span>
                      <span>
                        ${(newInvoice.subtotal + (newInvoice.subtotal * newInvoice.tax_rate) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c]"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
                    Create Invoice
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#272e3f] border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Total Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{invoices.length}</div>
                <p className="text-gray-400 text-sm">All time invoices</p>
              </CardContent>
            </Card>

            <Card className="bg-[#272e3f] border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
                <p className="text-gray-400 text-sm">Collected payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Invoices Table */}
          <Card className="bg-[#272e3f] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Invoice #</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Title</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Due Date</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-700 hover:bg-[#1a1f2c] transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{invoice.invoice_number}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white">
                            {invoice.customer?.first_name} {invoice.customer?.last_name}
                          </div>
                          {invoice.customer?.email && (
                            <div className="text-gray-400 text-sm">{invoice.customer.email}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white">{invoice.title}</div>
                          {invoice.description && (
                            <div className="text-gray-400 text-sm truncate max-w-xs">{invoice.description}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">${invoice.total_amount.toLocaleString()}</div>
                          {invoice.amount_paid > 0 && (
                            <div className="text-green-400 text-sm">${invoice.amount_paid.toLocaleString()} paid</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                            {invoice.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {invoice.due_date && (
                            <div className="flex items-center text-gray-300 text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c] bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c] bg-transparent"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c] bg-transparent"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredInvoices.length === 0 && (
                  <div className="text-center py-8 text-gray-400">No invoices found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
