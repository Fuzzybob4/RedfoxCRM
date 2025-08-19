"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
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

  const supabase = createClientComponentClient()
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
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      qualified: "bg-green-500",
      proposal: "bg-purple-500",
      negotiation: "bg-orange-500",
      closed_won: "bg-emerald-500",
      closed_lost: "bg-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1f2c] flex items-center justify-center">
        <div className="text-white">Loading customers...</div>
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
            <a href="/customers" className="flex items-center space-x-3 text-white bg-[#1a1f2c] p-3 rounded-lg">
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </a>
            <a
              href="/estimates"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>📋</span>
              <span>Estimates</span>
            </a>
            <a
              href="/invoices"
              className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-[#1a1f2c] p-3 rounded-lg transition-colors"
            >
              <span>🧾</span>
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
                  placeholder="Search customers..."
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
                  New Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#272e3f] border-gray-600 text-white max-w-2xl">
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
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={newCustomer.last_name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone_number}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead_status">Lead Status</Label>
                    <Select
                      value={newCustomer.lead_status}
                      onValueChange={(value) => setNewCustomer({ ...newCustomer, lead_status: value })}
                    >
                      <SelectTrigger className="bg-[#1a1f2c] border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#272e3f] border-gray-600">
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
                      <SelectTrigger className="bg-[#1a1f2c] border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#272e3f] border-gray-600">
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
                      className="bg-[#1a1f2c] border-gray-600 text-white"
                      rows={3}
                    />
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
                  <Button onClick={handleCreateCustomer} className="bg-blue-600 hover:bg-blue-700">
                    Create Customer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Card */}
          <div className="mb-8">
            <Card className="bg-[#272e3f] border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Total Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{customers.length}</div>
                <p className="text-gray-400 text-sm">Active customer accounts</p>
              </CardContent>
            </Card>
          </div>

          {/* Customers Table */}
          <Card className="bg-[#272e3f] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Location</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-700 hover:bg-[#1a1f2c] transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">
                            {customer.first_name} {customer.last_name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {customer.email && (
                              <div className="flex items-center text-gray-300 text-sm">
                                <Mail className="w-4 h-4 mr-2" />
                                {customer.email}
                              </div>
                            )}
                            {customer.phone_number && (
                              <div className="flex items-center text-gray-300 text-sm">
                                <Phone className="w-4 h-4 mr-2" />
                                {customer.phone_number}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {customer.address && (
                            <div className="flex items-center text-gray-300 text-sm">
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
                          <Badge className={`${getStatusColor(customer.lead_status)} text-white`}>
                            {customer.lead_status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300 capitalize">{customer.customer_type}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c] bg-transparent"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-[#1a1f2c] bg-transparent"
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
                  <div className="text-center py-8 text-gray-400">No customers found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
