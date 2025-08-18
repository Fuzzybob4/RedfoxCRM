"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Plus, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: string
  city: string
  state: string
  zip: string
  lead_status: string
  customer_type: string
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading customers:", error)
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        })
      } else {
        setCustomers(data || [])
      }
    } catch (error) {
      console.error("Error loading customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleImport() {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a CSV file to import",
        variant: "destructive",
      })
      return
    }

    setImporting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/customers/import", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Import failed")
      }

      toast({
        title: "Success",
        description: `Imported ${result.inserted} customers successfully`,
      })

      setFile(null)
      loadCustomers()
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Import failed",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone_number?.includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "lead":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Customers
          </h1>
          <p className="text-slate-600 mt-2">Manage your customer database and import new contacts</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Customers
          </CardTitle>
          <CardDescription>Upload a CSV file to import multiple customers at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button onClick={handleImport} disabled={!file || importing} className="bg-blue-500 hover:bg-blue-600">
              {importing ? "Importing..." : "Import CSV"}
            </Button>
          </div>
          {file && (
            <p className="text-sm text-slate-600 mt-2">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredCustomers.length} customers</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>All your customers and their information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-500">Loading customers...</div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm ? "No customers match your search." : "Get started by adding your first customer."}
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone_number}</TableCell>
                      <TableCell>
                        {customer.city && customer.state
                          ? `${customer.city}, ${customer.state}`
                          : customer.address || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.lead_status)}>{customer.lead_status || "New"}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{customer.customer_type || "Residential"}</TableCell>
                      <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
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
