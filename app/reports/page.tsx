"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Activity, DollarSign, Users, FileText, Briefcase } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { DashboardSidebar } from "@/app/components/dashboard-sidebar"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState("Your Business")
  const [stats, setStats] = useState({
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    totalCustomers: 0,
    totalProjects: 0,
    totalInvoices: 0,
    paidInvoices: 0,
  })
  const [outstandingPayments, setOutstandingPayments] = useState<any[]>([])
  const [recentPayments, setRecentPayments] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchReportsData()
  }, [])

  async function fetchReportsData() {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    // Get user's organization
    const { data: membership } = await supabase
      .from("user_memberships")
      .select("org_id")
      .eq("user_id", user.id)
      .limit(1)
      .single()

    if (!membership?.org_id) {
      setLoading(false)
      return
    }

    const orgId = membership.org_id

    // Fetch business profile for company name
    const { data: businessProfile } = await supabase
      .from("business_profiles")
      .select("business_name")
      .eq("org_id", orgId)
      .limit(1)
      .single()

    if (businessProfile?.business_name) {
      setCompanyName(businessProfile.business_name)
    }

    // Get current month dates
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

    // Fetch all data in parallel
    const [customersRes, projectsRes, invoicesRes, outstandingRes, recentPaidRes] = await Promise.all([
      supabase.from("customers").select("*", { count: "exact", head: true }).eq("org_id", orgId),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("org_id", orgId),
      supabase.from("invoices").select("total_amount, amount_paid, status, paid_date, created_at").eq("org_id", orgId),
      supabase
        .from("invoices")
        .select("id, invoice_number, title, total_amount, amount_paid, due_date, status, customer_id")
        .eq("org_id", orgId)
        .in("status", ["pending", "sent", "overdue"])
        .order("due_date", { ascending: true })
        .limit(10),
      supabase
        .from("invoices")
        .select("id, invoice_number, title, amount_paid, paid_date, customer_id")
        .eq("org_id", orgId)
        .eq("status", "paid")
        .order("paid_date", { ascending: false })
        .limit(5),
    ])

    // Calculate revenue
    let thisMonthRevenue = 0
    let lastMonthRevenue = 0
    let paidCount = 0

    if (invoicesRes.data) {
      invoicesRes.data.forEach((inv) => {
        if (inv.status === "paid") {
          paidCount++
          const paidDate = inv.paid_date ? new Date(inv.paid_date) : new Date(inv.created_at)
          if (paidDate >= new Date(thisMonthStart)) {
            thisMonthRevenue += Number(inv.amount_paid) || 0
          } else if (paidDate >= new Date(lastMonthStart) && paidDate <= new Date(lastMonthEnd)) {
            lastMonthRevenue += Number(inv.amount_paid) || 0
          }
        }
      })
    }

    setStats({
      thisMonthRevenue,
      lastMonthRevenue,
      totalCustomers: customersRes.count || 0,
      totalProjects: projectsRes.count || 0,
      totalInvoices: invoicesRes.data?.length || 0,
      paidInvoices: paidCount,
    })

    // Format outstanding payments
    const outstanding =
      outstandingRes.data?.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number || inv.title,
        amount: Number(inv.total_amount) - (Number(inv.amount_paid) || 0),
        dueDate: inv.due_date,
        status: inv.status,
      })) || []

    setOutstandingPayments(outstanding)

    // Format recent payments
    const recent =
      recentPaidRes.data?.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number || inv.title,
        amount: Number(inv.amount_paid),
        date: inv.paid_date,
      })) || []

    setRecentPayments(recent)
    setLoading(false)
  }

  const growthPercent =
    stats.lastMonthRevenue > 0
      ? (((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100).toFixed(1)
      : stats.thisMonthRevenue > 0
        ? "100"
        : "0"

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-64 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 lg:ml-64 flex flex-col overflow-auto">
        {/* Header */}
        <div className="h-16 bg-card flex items-center px-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Reports - {companyName}</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Revenue Overview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Revenue Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold text-foreground">${stats.thisMonthRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold text-foreground">${stats.lastMonthRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className={`text-2xl font-bold ${Number(growthPercent) >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {Number(growthPercent) >= 0 ? "+" : ""}
                    {growthPercent}%
                  </p>
                  <p className="text-sm text-muted-foreground">Growth</p>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalProjects}</p>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalInvoices}</p>
                    <p className="text-sm text-muted-foreground">Total Invoices</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.paidInvoices}</p>
                    <p className="text-sm text-muted-foreground">Paid Invoices</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Outstanding Payments */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Outstanding Payments</h2>
              {outstandingPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No outstanding payments</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outstandingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                        <TableCell>${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.dueDate || "Not set"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              payment.status === "overdue" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            {/* Recent Payments */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Payments Received</h2>
              {recentPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No payments received yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                        <TableCell className="text-green-600">${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.date || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
