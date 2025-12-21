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
import { Search, Plus, FileText, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
}

interface Estimate {
  id: string
  estimate_number: string
  title: string
  description?: string
  status: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total_amount: number
  valid_until?: string
  created_at: string
  customer?: Customer
}

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [newEstimate, setNewEstimate] = useState({
    customer_id: "",
    title: "",
    description: "",
    subtotal: 0,
    tax_rate: 8.5,
    valid_until: "",
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

      const [estimatesResult, customersResult] = await Promise.all([
        supabase
          .from("estimates")
          .select(`*, customer:customers(id, first_name, last_name, email)`)
          .eq("org_id", membership.org_id)
          .order("created_at", { ascending: false }),
        supabase.from("customers").select("id, first_name, last_name, email").eq("org_id", membership.org_id),
      ])

      if (estimatesResult.error) throw estimatesResult.error
      if (customersResult.error) throw customersResult.error

      setEstimates(estimatesResult.data || [])
      setCustomers(customersResult.data || [])
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({ title: "Error", description: "Failed to load estimates", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEstimate = async () => {
    if (!orgId) {
      toast({ title: "Error", description: "No organization found", variant: "destructive" })
      return
    }

    if (!newEstimate.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const taxAmount = (newEstimate.subtotal * newEstimate.tax_rate) / 100
      const totalAmount = newEstimate.subtotal + taxAmount

      const { error } = await supabase.from("estimates").insert([
        {
          org_id: orgId,
          created_by: user.id,
          customer_id: newEstimate.customer_id || null,
          estimate_number: `EST-${Date.now()}`,
          title: newEstimate.title.trim(),
          description: newEstimate.description.trim() || null,
          subtotal: newEstimate.subtotal,
          tax_rate: newEstimate.tax_rate,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          status: "draft",
          valid_until: newEstimate.valid_until || null,
        },
      ])

      if (error) throw error

      toast({ title: "Success", description: "Estimate created successfully" })
      setIsDialogOpen(false)
      setNewEstimate({ customer_id: "", title: "", description: "", subtotal: 0, tax_rate: 8.5, valid_until: "" })
      loadData()
    } catch (error) {
      console.error("[v0] Error creating estimate:", error)
      toast({ title: "Error", description: "Failed to create estimate", variant: "destructive" })
    }
  }

  const filteredEstimates = estimates.filter(
    (est) =>
      est.estimate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${est.customer?.first_name} ${est.customer?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500",
      sent: "bg-blue-500",
      viewed: "bg-yellow-500",
      accepted: "bg-green-500",
      declined: "bg-red-500",
      expired: "bg-gray-600",
    }
    return colors[status] || "bg-gray-500"
  }

  const totalValue = estimates.reduce((sum, est) => sum + (est.total_amount || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading estimates...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Estimates</h1>
            <p className="text-muted-foreground">Create and manage project estimates</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search estimates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Estimate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Estimate</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Customer (Optional)</Label>
                    <Select
                      value={newEstimate.customer_id}
                      onValueChange={(v) => setNewEstimate({ ...newEstimate, customer_id: v })}
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
                      value={newEstimate.title}
                      onChange={(e) => setNewEstimate({ ...newEstimate, title: e.target.value })}
                      placeholder="Estimate title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newEstimate.description}
                      onChange={(e) => setNewEstimate({ ...newEstimate, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subtotal ($)</Label>
                      <Input
                        type="number"
                        value={newEstimate.subtotal}
                        onChange={(e) =>
                          setNewEstimate({ ...newEstimate, subtotal: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newEstimate.tax_rate}
                        onChange={(e) =>
                          setNewEstimate({ ...newEstimate, tax_rate: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Valid Until</Label>
                    <Input
                      type="date"
                      value={newEstimate.valid_until}
                      onChange={(e) => setNewEstimate({ ...newEstimate, valid_until: e.target.value })}
                    />
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${newEstimate.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax ({newEstimate.tax_rate}%):</span>
                      <span>${((newEstimate.subtotal * newEstimate.tax_rate) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>
                        ${(newEstimate.subtotal + (newEstimate.subtotal * newEstimate.tax_rate) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEstimate}>Create Estimate</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <FileText className="w-4 h-4 mr-2" />
                Total Estimates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <DollarSign className="w-4 h-4 mr-2" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Estimates Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Estimate #</th>
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Valid Until</th>
                </tr>
              </thead>
              <tbody>
                {filteredEstimates.map((est) => (
                  <tr key={est.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">{est.estimate_number}</td>
                    <td className="py-4 px-4">
                      {est.customer ? `${est.customer.first_name} ${est.customer.last_name}` : "-"}
                    </td>
                    <td className="py-4 px-4">{est.title}</td>
                    <td className="py-4 px-4">${est.total_amount.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusColor(est.status)} text-white`}>{est.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      {est.valid_until ? new Date(est.valid_until).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
                {filteredEstimates.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No estimates found. Create your first estimate!
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
