"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Users, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  lead_status: string
  customer_type: string
  source?: string
  notes?: string
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    lead_status: "new",
    customer_type: "residential",
    source: "",
    notes: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase.from("profiles").select("default_org").eq("id", user.id).maybeSingle()

      if (!prof?.default_org) return

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("org_id", prof.default_org)
        .order("created_at", { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCustomer = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase.from("profiles").select("default_org").eq("id", user.id).maybeSingle()

      if (!prof?.default_org) {
        toast({
          title: "Error",
          description: "No organization found",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("customers").insert([
        {
          ...newCustomer,
          org_id: prof.default_org,
          owner_id: user.id,
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Customer created successfully",
      })

      setIsDialogOpen(false)
      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        lead_status: "new",
        customer_type: "residential",
        source: "",
        notes: "",
      })
      fetchCustomers()
    } catch (error) {
      console.error("Error creating customer:", error)
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      })
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone_number?.includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-primary",
      contacted: "bg-accent",
      qualified: "bg-success",
      proposal: "bg-secondary",
      negotiation: "bg-brand-orange",
      closed_won: "bg-success",
      closed_lost: "bg-destructive",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading customers...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card min-h-screen p-6 border-r border-border">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-foreground">RedFox CRM</h1>
            <p className="text-muted-foreground text-sm">Acme Landscaping</p>
          </div>

          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent p-3 rounded-lg transition-colors"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/customers" className="flex items-center space-x-3 text-foreground bg-accent p-3 rounded-lg">
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </a>
            <a
              href="/estimates"
              className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent p-3 rounded-lg transition-colors"
            >
              <span>📋</span>
              <span>Estimates</span>
            </a>
            <a
              href="/invoices"
              className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent p-3 rounded-lg transition-colors"
            >
              <span>🧾</span>
              <span>Invoices</span>
            </a>
            <a
              href="/projects"
              className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent p-3 rounded-lg transition-colors"
            >
              <span>🏗️</span>
              <span>Projects</span>
            </a>
            <a
              href="/settings"
              className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent p-3 rounded-lg transition-colors"
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground w-80"
                />
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  New Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={newCustomer.first_name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={newCustomer.last_name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone_number}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead_status">Lead Status</Label>
                    <Select
                      value={newCustomer.lead_status}
                      onValueChange={(value) => setNewCustomer({ ...newCustomer, lead_status: value })}
                    >
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed_won">Closed Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="customer_type">Customer Type</Label>
                    <Select
                      value={newCustomer.customer_type}
                      onValueChange={(value) => setNewCustomer({ ...newCustomer, customer_type: value })}
                    >
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                      className="bg-background border-border text-foreground"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-border text-muted-foreground hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCustomer}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Create Customer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Card */}
          <div className="mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Total Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{customers.length}</div>
                <p className="text-muted-foreground text-sm">Active customer accounts</p>
              </CardContent>
            </Card>
          </div>

          {/* Customers Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Location</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-border hover:bg-accent transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-foreground font-medium">
                            {customer.first_name} {customer.last_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {customer.email && (
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Mail className="w-4 h-4 mr-2" />
                                {customer.email}
                              </div>
                            )}
                            {customer.phone_number && (
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Phone className="w-4 h-4 mr-2" />
                                {customer.phone_number}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {customer.address && (
                            <div className="flex items-center text-muted-foreground text-sm">
                              <MapPin className="w-4 h-4 mr-2" />
                              <div>
                                {customer.address}
                                {customer.city && customer.state && (
                                  <div>
                                    {customer.city}, {customer.state} {customer.zip}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getStatusColor(customer.lead_status)} text-foreground`}>
                            {customer.lead_status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-muted-foreground capitalize">{customer.customer_type}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border text-muted-foreground hover:bg-accent bg-transparent"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border text-muted-foreground hover:bg-accent bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No customers found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
