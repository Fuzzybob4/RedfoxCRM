"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowDown,
  MoreVertical,
  Download,
  LayoutDashboard,
  ScrollText,
  Package,
  Users,
  BarChart,
  Settings,
  UserPlus,
  Upload,
  ArrowUp,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

interface Customer {
  id: number
  owner_id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  city: string
  state: string
  zip: string
  lead_status: string
}

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Orders", href: "/orders" },
  { icon: <Package className="h-5 w-5" />, label: "Products", href: "/products" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers", active: true },
  { icon: <BarChart className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Integrations", href: "/integrations" },
]

const leadStatusOptions = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]

export default function CustomersPage() {
  const [customerCount, setCustomerCount] = useState(0)
  const [decreasePercentage] = useState(13)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id" | "owner_id">>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    lead_status: "New",
  })
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [paidInvoices, setPaidInvoices] = useState(0)
  const [invoiceIncreasePercentage] = useState(5)
  const [companyName, setCompanyName] = useState("RedFox CRM User") // Updated initial state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkAuthAndLoadCustomers() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      fetchCompanyName(user)
      fetchCustomers(user)
    }

    checkAuthAndLoadCustomers()
  }, [router])

  async function fetchCompanyName(user: User) {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("company_name")
        .eq("owner_id", user.id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // No company profile found, set a default name
          setCompanyName("My Company")
        } else {
          console.error("Error fetching company name:", error)
          // Set a generic company name in case of other errors
          setCompanyName("RedFox CRM User")
        }
      } else if (data && data.company_name) {
        setCompanyName(data.company_name)
      } else {
        // If no error but also no data, set a default name
        setCompanyName("My Company")
      }
    } catch (error) {
      console.error("Unexpected error fetching company name:", error)
      setCompanyName("RedFox CRM User")
    }
  }

  async function fetchCustomers(user: User) {
    if (!user) {
      console.error("No user found")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from("customers").select("*").eq("owner_id", user.id)

    if (error) {
      console.error("Error fetching customers:", error)
    } else {
      setCustomers(data)
      setCustomerCount(data.length)
    }

    setLoading(false)
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a customer.",
        variant: "destructive",
      })
      return
    }

    const { data, error } = await supabase
      .from("customers")
      .insert([{ ...newCustomer, owner_id: user.id }])
      .select()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Customer added successfully.",
      })
      setCustomers([...customers, data[0] as Customer])
      setCustomerCount(customerCount + 1)
      setIsAddCustomerOpen(false)
      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        lead_status: "New",
      })
    }
  }

  const handleUploadCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const csvData = event.target?.result as string
      const rows = csvData.split("\n").slice(1) // Assume first row is header

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload customers.",
          variant: "destructive",
        })
        return
      }

      const newCustomers = rows.map((row) => {
        const [first_name, last_name, email, phone_number, address, city, state, zip, lead_status] = row.split(",")
        return {
          owner_id: user.id,
          first_name,
          last_name,
          email,
          phone_number,
          address,
          city,
          state,
          zip,
          lead_status,
        }
      })

      const { data, error } = await supabase.from("customers").insert(newCustomers).select()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to upload CSV. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `${newCustomers.length} customers added successfully.`,
        })
        setCustomers([...customers, ...(data as Customer[])])
        setCustomerCount(customerCount + newCustomers.length)
      }
    }
    reader.readAsText(file)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1a1f2c]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#1a1f2c]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#272e3f] text-gray-300">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold text-white">{companyName}</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                ${item.active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Saved Reports Section */}
        <div className="p-4 border-t border-gray-700">
          <h2 className="text-xs font-semibold text-gray-400 uppercase mb-4">SAVED REPORTS</h2>
          <nav className="space-y-2">
            <Link
              href="/reports/current-month"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 rounded-md"
            >
              Current month
            </Link>
            <Link
              href="/reports/last-quarter"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 rounded-md"
            >
              Last quarter
            </Link>
            <Link
              href="/reports/engagement"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 rounded-md"
            >
              Social engagement
            </Link>
            <Link
              href="/reports/year-end"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 rounded-md"
            >
              Year-end sale
            </Link>
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Top Search Bar */}
        <div className="h-16 bg-[#272e3f] flex items-center px-4 border-b border-gray-700">
          <div className="flex-1 flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search customers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1f2c] border-gray-700 text-white w-full max-w-md"
            />
            <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#272e3f] text-white">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCustomer} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={newCustomer.first_name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                        className="bg-[#1a1f2c] border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={newCustomer.last_name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                        className="bg-[#1a1f2c] border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={newCustomer.phone_number}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="bg-[#1a1f2c] border-gray-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newCustomer.city}
                        onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                        className="bg-[#1a1f2c] border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newCustomer.state}
                        onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                        className="bg-[#1a1f2c] border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP</Label>
                      <Input
                        id="zip"
                        value={newCustomer.zip}
                        onChange={(e) => setNewCustomer({ ...newCustomer, zip: e.target.value })}
                        className="bg-[#1a1f2c] border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lead_status">Lead Status</Label>
                    <Select
                      value={newCustomer.lead_status}
                      onValueChange={(value) => setNewCustomer({ ...newCustomer, lead_status: value })}
                    >
                      <SelectTrigger className="bg-[#1a1f2c] border-gray-700 text-white">
                        <SelectValue placeholder="Select lead status" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">
                    Add Customer
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleUploadCSV} accept=".csv" className="hidden" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="flex gap-6 mb-8">
              {/* New Customers Card */}
              <Card className="w-[300px] bg-[#e85d3d] text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">TOTAL CUSTOMERS</p>
                      <h2 className="text-4xl font-bold">{customerCount}</h2>
                    </div>
                    <ArrowDown className="h-6 w-6" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">{decreasePercentage}% DECREASE</p>
                  </div>
                </div>
              </Card>

              {/* Paid Invoices Card */}
              <Card className="w-[300px] bg-[#4CAF50] text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">PAID INVOICES</p>
                      <h2 className="text-4xl font-bold">{paidInvoices}</h2>
                    </div>
                    <ArrowUp className="h-6 w-6" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">{invoiceIncreasePercentage}% INCREASE</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Customers Table */}
            <div className="bg-[#272e3f] rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-white">Customers</h2>
                  <span className="text-gray-400 text-sm">| {customerCount} Customers</span>
                </div>
                <Button variant="ghost" size="icon" className="text-white">
                  <Download className="h-5 w-5" />
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Phone</TableHead>
                    <TableHead className="text-gray-400">Address</TableHead>
                    <TableHead className="text-gray-400">Lead Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell className="text-white">{customer.email}</TableCell>
                      <TableCell className="text-white">{customer.phone_number}</TableCell>
                      <TableCell className="text-white">
                        {customer.address}, {customer.city}, {customer.state} {customer.zip}
                      </TableCell>
                      <TableCell className="text-white">{customer.lead_status}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
