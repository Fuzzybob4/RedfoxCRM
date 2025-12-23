"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import { MapPin, ArrowLeft } from "lucide-react"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  notes: string
  created_at: string
  updated_at: string
  org_id: string
}

interface Estimate {
  id: string
  estimate_number: string
  total_amount: number
  status: string
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  total_amount: number
  amount_paid: number
  status: string
  created_at: string
}

interface Project {
  id: string
  name: string
  status: string
  start_date: string | null
  end_date: string | null
}

export default function CustomerDetailPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [lifetimeSpend, setLifetimeSpend] = useState(0)
  const [outstandingBalance, setOutstandingBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string
  const supabase = createClient()

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }

        const { data: membership } = await supabase
          .from("user_memberships")
          .select("org_id")
          .eq("user_id", user.id)
          .single()

        if (!membership) {
          router.push("/setup-organization")
          return
        }

        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", customerId)
          .eq("org_id", membership.org_id)
          .single()

        if (customerError) throw customerError
        setCustomer(customerData)

        // Fetch estimates
        const { data: estimatesData } = await supabase
          .from("estimates")
          .select("*")
          .eq("customer_id", customerId)
          .eq("org_id", membership.org_id)
          .order("created_at", { ascending: false })
          .limit(5)

        setEstimates(estimatesData || [])

        // Fetch invoices
        const { data: invoicesData } = await supabase
          .from("invoices")
          .select("*")
          .eq("customer_id", customerId)
          .eq("org_id", membership.org_id)
          .order("created_at", { ascending: false })
          .limit(5)

        setInvoices(invoicesData || [])

        // Fetch projects
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*")
          .eq("customer_id", customerId)
          .eq("org_id", membership.org_id)
          .order("created_at", { ascending: false })
          .limit(5)

        setProjects(projectsData || [])

        // Calculate lifetime spend and outstanding balance
        if (invoicesData) {
          const totalPaid = invoicesData.reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0)
          const totalAmount = invoicesData.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0)
          setLifetimeSpend(totalPaid)
          setOutstandingBalance(totalAmount - totalPaid)
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)
        router.push("/contacts")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [supabase, router, customerId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F2EA]">
        <p className="text-gray-500">Loading customer details...</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] p-8">
        <Button onClick={() => router.push("/contacts")} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">Customer not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const propertyNotes = customer.notes ? customer.notes.split("\n").filter((note) => note.trim()) : []

  const activityItems = [
    ...estimates.map((est) => ({
      date: new Date(est.created_at),
      type: "estimate" as const,
      text: `Estimate ${est.status === "accepted" ? "Accepted" : "Sent"}`,
      amount: est.total_amount,
      color: "#C864FF", // Orchid
    })),
    ...projects.map((proj) => ({
      date: proj.start_date ? new Date(proj.start_date) : new Date(proj.end_date || Date.now()),
      type: "project" as const,
      text:
        proj.status === "completed"
          ? "Job Completed"
          : proj.status === "in_progress"
            ? "Install Scheduled"
            : "Project Created",
      color: proj.status === "completed" ? "#64FFC8" : "#FFC864", // Mint or Fox Gold
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-[#F5F2EA]">
      <div className="max-w-[1440px] mx-auto p-6">
        {/* Back Button */}
        <Button onClick={() => router.push("/contacts")} variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>

        {/* Header Card - Full Width */}
        <Card className="mb-6 bg-white border-[#E4E0D6] rounded-2xl">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div>
                  <CardTitle className="text-4xl text-[#050103] font-bold">
                    {customer.first_name} {customer.last_name}
                  </CardTitle>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#64FFC8] text-[#050103]">
                      Active Customer
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-[#FFC864] hover:bg-[#FFB84D] text-[#050103] font-semibold px-6">
                  Create Estimate
                </Button>
                <Button
                  variant="outline"
                  className="border-[#C864FF] text-[#C864FF] hover:bg-[#C864FF]/10 px-6 bg-transparent"
                >
                  Schedule Job
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT COLUMN - 30% */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Contact Information */}
            <Card className="bg-white border-[#E4E0D6] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.email && (
                  <div>
                    <p className="text-sm text-gray-700 font-semibold mb-1">Email</p>
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-[#050103] hover:text-[#FFC864] font-bold text-base"
                    >
                      {customer.email}
                    </a>
                  </div>
                )}
                {customer.phone && (
                  <div>
                    <p className="text-sm text-gray-700 font-semibold mb-1">Phone</p>
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-[#050103] hover:text-[#FFC864] font-bold text-base"
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}
                {customer.address && (
                  <div>
                    <p className="text-sm text-gray-700 font-semibold mb-1">Address</p>
                    <p className="text-[#050103] font-bold text-base">{customer.address}</p>
                    <p className="text-[#050103] font-bold text-base">
                      {customer.city}
                      {customer.state && `, ${customer.state}`} {customer.zip_code}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Location - Mini Map */}
            <Card className="bg-white border-[#C864FF] border-2 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Property Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#F5F2EA] rounded-xl flex items-center justify-center relative overflow-hidden">
                  <MapPin className="w-12 h-12 text-[#FFC864]" />
                  <p className="absolute bottom-3 text-sm text-[#777777]">Mini Map</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Notes */}
            <Card className="bg-[#FBF8F1] border-[#E4E0D6] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Property Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {propertyNotes.length > 0 ? (
                  <ul className="space-y-2 list-disc list-inside text-[#050103] font-bold">
                    {propertyNotes.map((note, idx) => (
                      <li key={idx} className="text-base">
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 text-sm font-semibold">No property notes</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* CENTER COLUMN - 40% */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Customer Activity Timeline */}
            <Card className="bg-white border-[#E4E0D6] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Customer Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activityItems.length > 0 ? (
                  <div className="space-y-4">
                    {activityItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          {idx < activityItems.length - 1 && <div className="w-0.5 h-12 bg-gray-400 my-1" />}
                        </div>
                        <div className="flex-1 pt-0">
                          <p className="text-sm text-gray-700 font-semibold">
                            {item.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                          <p className="text-[#050103] font-bold text-base">
                            {item.text}
                            {item.type === "estimate" && item.amount && (
                              <span className="text-gray-700 ml-2 font-bold">(${item.amount.toLocaleString()})</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm text-center py-8 font-semibold">No activity yet</p>
                )}
              </CardContent>
            </Card>

            {/* Property & Project Photos */}
            <Card className="bg-white border-[#E4E0D6] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Property & Project Photos</CardTitle>
                <CardDescription className="text-gray-700 font-semibold">
                  Front • Roofline • Trees • After Install
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 text-sm font-medium"
                    >
                      Image
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - 30% */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Jobs */}
            <Card className="bg-white border-[#E4E0D6] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="px-4 py-2 rounded-full bg-[#64FFC8] text-[#050103] text-sm font-bold"
                      >
                        {project.name} • {project.status === "completed" ? "Completed" : "In Progress"}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm text-center py-4 font-semibold">No jobs yet</p>
                )}
              </CardContent>
            </Card>

            {/* Estimates */}
            <Card className="bg-white border-[#E4E0D6] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                {estimates.length > 0 ? (
                  <div className="space-y-2">
                    {estimates.map((estimate) => (
                      <div
                        key={estimate.id}
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          estimate.status === "accepted" ? "bg-[#C864FF] text-white" : "bg-gray-100 text-[#050103]"
                        }`}
                      >
                        {estimate.estimate_number} • ${estimate.total_amount.toLocaleString()}
                        {estimate.status === "accepted" && " (Accepted)"}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm text-center py-4 font-semibold">No estimates yet</p>
                )}
              </CardContent>
            </Card>

            {/* Customer Value */}
            <Card className="bg-white border-[#E4E0D6] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#050103]">Customer Value</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Lifetime Spend</p>
                  <p className="text-3xl font-bold text-[#050103]">${lifetimeSpend.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Outstanding Balance</p>
                  <p className="text-2xl font-semibold text-[#050103]">${outstandingBalance.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
