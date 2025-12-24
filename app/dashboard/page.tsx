"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/app/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, TrendingUp, AlertCircle, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  totalCustomers: number
  activeProjects: number
  totalInvoices: number
  pendingEstimates: number
  totalRevenue: number
  outstandingAmount: number
}

export default function DashboardPage() {
  const { user, loading, role } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeProjects: 0,
    totalInvoices: 0,
    pendingEstimates: 0,
    totalRevenue: 0,
    outstandingAmount: 0,
  })
  const [recentCustomers, setRecentCustomers] = useState<any[]>([])
  const [recentInvoices, setRecentInvoices] = useState<any[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [orgId, setOrgId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?message=Please sign in to access your dashboard.")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  async function fetchDashboardData() {
    const supabase = createClient()
    setStatsLoading(true)

    try {
      // Get user's organization
      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user?.id)
        .limit(1)
        .maybeSingle()

      if (!membership?.org_id) {
        router.push("/setup-organization")
        setStatsLoading(false)
        return
      }

      setOrgId(membership.org_id)
      const currentOrgId = membership.org_id

      // Fetch all stats in parallel
      const [customersRes, projectsRes, invoicesRes, estimatesRes, recentCustomersRes, recentInvoicesRes] =
        await Promise.all([
          supabase.from("customers").select("*", { count: "exact", head: true }).eq("org_id", currentOrgId),
          supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("org_id", currentOrgId)
            .in("status", ["in_progress", "planning"]),
          supabase.from("invoices").select("total_amount, amount_paid, status").eq("org_id", currentOrgId),
          supabase
            .from("estimates")
            .select("*", { count: "exact", head: true })
            .eq("org_id", currentOrgId)
            .eq("status", "pending"),
          supabase
            .from("customers")
            .select("id, first_name, last_name, email, created_at")
            .eq("org_id", currentOrgId)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("invoices")
            .select("id, invoice_number, title, total_amount, status, created_at")
            .eq("org_id", currentOrgId)
            .order("created_at", { ascending: false })
            .limit(5),
        ])

      // Calculate revenue totals
      let totalRevenue = 0
      let outstandingAmount = 0
      if (invoicesRes.data) {
        invoicesRes.data.forEach((inv) => {
          totalRevenue += Number(inv.amount_paid) || 0
          if (inv.status !== "paid") {
            outstandingAmount += Number(inv.total_amount) - (Number(inv.amount_paid) || 0)
          }
        })
      }

      setStats({
        totalCustomers: customersRes.count || 0,
        activeProjects: projectsRes.count || 0,
        totalInvoices: invoicesRes.data?.length || 0,
        pendingEstimates: estimatesRes.count || 0,
        totalRevenue,
        outstandingAmount,
      })

      setRecentCustomers(recentCustomersRes.data || [])
      setRecentInvoices(recentInvoicesRes.data || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Customers",
      value: statsLoading ? "..." : stats.totalCustomers.toString(),
      icon: Users,
      color: "text-blue-600",
      href: "/customers",
    },
    {
      title: "Active Projects",
      value: statsLoading ? "..." : stats.activeProjects.toString(),
      icon: FileText,
      color: "text-green-600",
      href: "/projects",
    },
    {
      title: "Total Revenue",
      value: statsLoading ? "..." : `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-brand-orange",
      href: "/invoices",
    },
    {
      title: "Outstanding",
      value: statsLoading ? "..." : `$${stats.outstandingAmount.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-purple-600",
      href: "/invoices",
    },
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your business today.
          {role && <span className="text-brand-orange ml-2">(Role: {role})</span>}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Customers
              </CardTitle>
              <CardDescription>Latest customers added</CardDescription>
            </div>
            <Link href="/customers" className="text-sm text-brand-orange hover:underline flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add New
            </Link>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : recentCustomers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No customers yet.</p>
                <Link href="/customers" className="text-brand-orange hover:underline">
                  Add your first customer
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
                      <span className="text-brand-orange font-medium text-sm">
                        {customer.first_name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {customer.first_name} {customer.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(customer.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Invoices
              </CardTitle>
              <CardDescription>Latest invoices created</CardDescription>
            </div>
            <Link href="/invoices" className="text-sm text-brand-orange hover:underline flex items-center gap-1">
              <Plus className="h-4 w-4" /> Create New
            </Link>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : recentInvoices.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No invoices yet.</p>
                <Link href="/invoices" className="text-brand-orange hover:underline">
                  Create your first invoice
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-500"
                          : invoice.status === "overdue"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{invoice.invoice_number || invoice.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{invoice.status}</p>
                    </div>
                    <span className="text-sm font-medium">${Number(invoice.total_amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/customers" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Add New Customer</div>
                <div className="text-sm text-muted-foreground">Create a new customer profile</div>
              </Link>
              <Link href="/invoices" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Create Invoice</div>
                <div className="text-sm text-muted-foreground">Generate a new invoice</div>
              </Link>
              <Link href="/estimates" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Create Estimate</div>
                <div className="text-sm text-muted-foreground">Send a quote to a customer</div>
              </Link>
              <Link href="/projects" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Start Project</div>
                <div className="text-sm text-muted-foreground">Create a new project</div>
              </Link>
              <Link href="/products" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Add Product</div>
                <div className="text-sm text-muted-foreground">Add to your product catalog</div>
              </Link>
              <Link href="/reports" className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">View Reports</div>
                <div className="text-sm text-muted-foreground">See your business analytics</div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
