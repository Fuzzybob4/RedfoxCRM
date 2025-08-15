"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Building } from "lucide-react"

const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@acmecorp.com",
    company: "Acme Corp",
    phone: "+1 (555) 123-4567",
    status: "active",
    lastContact: "2024-01-15",
    dealValue: "$50,000",
    tags: ["Enterprise", "High Value"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@techstart.com",
    company: "TechStart Inc",
    phone: "+1 (555) 987-6543",
    status: "prospect",
    lastContact: "2024-01-12",
    dealValue: "$12,000",
    tags: ["Startup", "Tech"],
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@globalsolutions.com",
    company: "Global Solutions",
    phone: "+1 (555) 456-7890",
    status: "active",
    lastContact: "2024-01-10",
    dealValue: "$75,000",
    tags: ["Enterprise", "Long-term"],
  },
  {
    id: 4,
    name: "Emily Chen",
    email: "emily@innovatetech.com",
    company: "InnovateTech",
    phone: "+1 (555) 234-5678",
    status: "inactive",
    lastContact: "2023-12-20",
    dealValue: "$8,500",
    tags: ["SMB", "Tech"],
  },
]

const statusColors = {
  active: "default",
  prospect: "secondary",
  inactive: "outline",
} as const

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships and contacts</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCustomers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCustomers.filter((c) => c.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCustomers.filter((c) => c.status === "prospect").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {filteredCustomers
                .reduce((sum, c) => sum + Number.parseInt(c.dealValue.replace(/[$,]/g, "")), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search customers, companies, or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <Badge variant={statusColors[customer.status as keyof typeof statusColors]}>
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {customer.company}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span>
                        <span className="font-medium">Deal Value:</span> {customer.dealValue}
                      </span>
                      <span>
                        <span className="font-medium">Last Contact:</span> {customer.lastContact}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No customers found matching your criteria.</p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Customer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
