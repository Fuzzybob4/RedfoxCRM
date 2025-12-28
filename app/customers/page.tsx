"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Users, Phone, Mail, MapPin, Edit, Trash2, Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { DashboardSidebar } from "@/app/components/dashboard-sidebar"

import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  notes?: string
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    notes: "",
  })
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; name: string }[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/login")
        return
      }

      const { data: membership, error: membershipError } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (membershipError) {
        console.error("[v0] Error fetching membership:", membershipError)
      }

      if (!membership?.org_id) {
        // No organization - redirect to setup
        toast({
          title: "Setup Required",
          description: "Please set up your organization first.",
        })
        router.replace("/setup-organization")
        return
      }

      setOrgId(membership.org_id)

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("org_id", membership.org_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error("[v0] Error fetching customers:", error)
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
    console.log("[v0] handleCreateCustomer called")
    console.log("[v0] orgId:", orgId)
    console.log("[v0] newCustomer:", newCustomer)

    if (!newCustomer.first_name.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive",
      })
      return
    }

    if (!newCustomer.last_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        variant: "destructive",
      })
      return
    }

    if (!orgId) {
      console.log("[v0] No orgId found - checking user membership...")
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log("[v0] Current user:", user?.id)

      if (user) {
        const { data: membership, error: membershipError } = await supabase
          .from("user_memberships")
          .select("org_id")
          .eq("user_id", user.id)
          .maybeSingle()

        console.log("[v0] Membership lookup:", membership, "Error:", membershipError)

        if (membership?.org_id) {
          setOrgId(membership.org_id)
          // Continue with creation using the fetched orgId
          await createCustomerWithOrg(membership.org_id)
          return
        }
      }

      toast({
        title: "Error",
        description: "No organization found. Please complete onboarding first.",
        variant: "destructive",
      })
      return
    }

    await createCustomerWithOrg(orgId)
  }

  const createCustomerWithOrg = async (organizationId: string) => {
    console.log("[v0] Creating customer with org:", organizationId)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data: insertedData, error } = await supabase
        .from("customers")
        .insert([
          {
            first_name: newCustomer.first_name.trim(),
            last_name: newCustomer.last_name.trim(),
            email: newCustomer.email.trim() || null,
            phone: newCustomer.phone.trim() || null,
            address: newCustomer.address.trim() || null,
            city: newCustomer.city.trim() || null,
            state: newCustomer.state.trim() || null,
            zip_code: newCustomer.zip_code.trim() || null,
            country: newCustomer.country.trim() || null,
            notes: newCustomer.notes.trim() || null,
            org_id: organizationId,
          },
        ])
        .select()
        .single()

      console.log("[v0] Customer insert result:", insertedData, "Error:", error)

      if (error) {
        console.error("[v0] Error creating customer:", error)
        toast({
          title: "Error",
          description: `Failed to create customer: ${error.message}`,
          variant: "destructive",
        })
        return
      }

      // If we have photos and a customer was created, save the photos
      if (insertedData && uploadedPhotos.length > 0) {
        console.log("[v0] Saving photos for customer:", insertedData.id)
        const photoInserts = uploadedPhotos.map((photo) => ({
          customer_id: insertedData.id,
          org_id: organizationId,
          uploaded_by: user?.id,
          photo_url: photo.url,
          photo_type: "property",
          description: photo.name,
        }))

        const { error: photoError } = await supabase.from("customer_photos").insert(photoInserts)

        if (photoError) {
          console.error("[v0] Error saving photos:", photoError)
        }
      }

      toast({
        title: "Success",
        description: "Customer created successfully!",
      })

      // Reset form and close dialog
      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        notes: "",
      })
      setUploadedPhotos([])
      setIsDialogOpen(false)

      // Refresh customer list
      fetchCustomers()
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/customers/photos/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Upload failed")
        }

        const blob = await response.json()
        return { url: blob.url, name: file.name }
      })

      const newPhotos = await Promise.all(uploadPromises)
      setUploadedPhotos([...uploadedPhotos, ...newPhotos])

      toast({
        title: "Success",
        description: `${newPhotos.length} photo(s) uploaded successfully`,
      })
    } catch (error) {
      console.error("[v0] Error uploading photos:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload photos",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (url: string) => {
    setUploadedPhotos(uploadedPhotos.filter((photo) => photo.url !== url))
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm),
  )

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
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-8">
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
                <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={newCustomer.first_name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name *</Label>
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
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
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
                      <Label htmlFor="zip_code">Zip Code</Label>
                      <Input
                        id="zip_code"
                        value={newCustomer.zip_code}
                        onChange={(e) => setNewCustomer({ ...newCustomer, zip_code: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newCustomer.country}
                        onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                        className="bg-background border-border text-foreground"
                      />
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

                    {/* Photo upload section */}
                    <div className="col-span-2">
                      <Label>Property Photos (Optional)</Label>
                      <div className="mt-2">
                        <label className="cursor-pointer">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>

                        {/* Display uploaded photos */}
                        {uploadedPhotos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {uploadedPhotos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photo.url || "/placeholder.svg"}
                                  alt={photo.name}
                                  className="w-full h-24 object-cover rounded-lg border border-border"
                                />
                                <button
                                  onClick={() => removePhoto(photo.url)}
                                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {isUploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setUploadedPhotos([])
                      }}
                      className="border-border text-muted-foreground hover:bg-accent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCustomer}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isUploading}
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
                  <Table className="w-full">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell className="text-left py-3 px-4 text-muted-foreground font-medium">
                          Name
                        </TableHeaderCell>
                        <TableHeaderCell className="text-left py-3 px-4 text-muted-foreground font-medium">
                          Contact
                        </TableHeaderCell>
                        <TableHeaderCell className="text-left py-3 px-4 text-muted-foreground font-medium">
                          Location
                        </TableHeaderCell>
                        <TableHeaderCell className="text-left py-3 px-4 text-muted-foreground font-medium">
                          Actions
                        </TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow
                          key={customer.id}
                          className="border-b border-border hover:bg-accent transition-colors cursor-pointer"
                        >
                          <TableCell className="py-4 px-4">
                            <Link href={`/customers/${customer.id}`}>
                              <div className="text-foreground font-medium hover:text-primary transition-colors">
                                {customer.first_name} {customer.last_name}
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            <div className="space-y-1">
                              {customer.email && (
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <Mail className="w-4 h-4 mr-2" />
                                  {customer.email}
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <Phone className="w-4 h-4 mr-2" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-4">
                            {customer.address && (
                              <div className="flex items-center text-muted-foreground text-sm">
                                <MapPin className="w-4 h-4 mr-2" />
                                <div>
                                  {customer.address}
                                  {customer.city && customer.state && (
                                    <div>
                                      {customer.city}, {customer.state} {customer.zip_code}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4 px-4">
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No customers match your search" : "No customers yet. Add your first customer!"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for TableHeaderCell
function TableHeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left py-3 px-4 text-muted-foreground font-medium ${className}`}>{children}</th>
}
