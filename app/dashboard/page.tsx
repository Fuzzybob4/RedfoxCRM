"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, TrendingUp, Calendar, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { user, loading, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?message=Please sign in to access your dashboard.")
    }
  }, [user, loading, router])

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

  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Projects",
      value: "56",
      change: "+8%",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: "$45,678",
      change: "+23%",
      icon: DollarSign,
      color: "text-brand-orange",
    },
    {
      title: "Growth Rate",
      value: "18.2%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const recentActivities = [
    { id: 1, action: "New customer added", time: "2 hours ago", type: "customer" },
    { id: 2, action: "Invoice #1234 sent", time: "4 hours ago", type: "invoice" },
    { id: 3, action: "Project completed", time: "1 day ago", type: "project" },
    { id: 4, action: "Payment received", time: "2 days ago", type: "payment" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name || user?.user_metadata?.full_name || "User"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your business today.{" "}
          {role && <span className="text-brand-orange">(Role: {role})</span>}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success mt-1">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Add New Customer</div>
                <div className="text-sm text-muted-foreground">Create a new customer profile</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Create Invoice</div>
                <div className="text-sm text-muted-foreground">Generate a new invoice</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="font-medium text-foreground">Schedule Appointment</div>
                <div className="text-sm text-muted-foreground">Book a new appointment</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
