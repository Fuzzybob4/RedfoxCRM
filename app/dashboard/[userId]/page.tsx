"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  Mail,
  User,
  LayoutDashboard,
  Activity,
  Users2,
  DollarSign,
  FileText,
  Bell,
  Briefcase,
  Receipt,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  id: string
  full_name: string
  email: string
}

interface StatItem {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  href: string
}

export default function DashboardPage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatItem[]>([])
  const [businessName, setBusinessName] = useState("My Business")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Overview",
      href: `/dashboard/${params.userId}`,
      active: true,
    },
    { icon: <Users2 className="h-5 w-5" />, label: "Customers", href: "/customers" },
    { icon: <Receipt className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
    { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
    { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
    { icon: <DollarSign className="h-5 w-5" />, label: "Products", href: "/products" },
  ]

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/login")
          return
        }

        if (authUser.id !== params.userId) {
          router.push(`/dashboard/${authUser.id}`)
          return
        }

        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", authUser.id)
          .single()

        setUser({
          id: authUser.id,
          full_name: profile?.full_name || "User",
          email: profile?.email || authUser.email || "",
        })

        // Get user's organization
        const { data: membership } = await supabase
          .from("user_memberships")
          .select("org_id")
          .eq("user_id", authUser.id)
          .maybeSingle()

        if (!membership?.org_id) {
          console.log("[v0] No organization found for user")
          setStats([
            {
              title: "Customers",
              value: 0,
              icon: <Users className="h-6 w-6" />,
              color: "bg-blue-500",
              href: "/customers",
            },
            {
              title: "Invoices",
              value: 0,
              icon: <Receipt className="h-6 w-6" />,
              color: "bg-green-500",
              href: "/invoices",
            },
            {
              title: "Estimates",
              value: 0,
              icon: <FileText className="h-6 w-6" />,
              color: "bg-orange-500",
              href: "/estimates",
            },
            {
              title: "Projects",
              value: 0,
              icon: <Briefcase className="h-6 w-6" />,
              color: "bg-purple-500",
              href: "/projects",
            },
          ])
          return
        }

        // Get business name
        const { data: business } = await supabase
          .from("business_profiles")
          .select("business_name")
          .eq("org_id", membership.org_id)
          .maybeSingle()

        if (business?.business_name) {
          setBusinessName(business.business_name)
        }

        // Fetch counts for all stats
        const [customerResult, invoiceResult, estimateResult, projectResult] = await Promise.all([
          supabase.from("customers").select("*", { count: "exact", head: true }).eq("org_id", membership.org_id),
          supabase.from("invoices").select("*", { count: "exact", head: true }).eq("org_id", membership.org_id),
          supabase.from("estimates").select("*", { count: "exact", head: true }).eq("org_id", membership.org_id),
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("org_id", membership.org_id),
        ])

        setStats([
          {
            title: "Customers",
            value: customerResult.count || 0,
            icon: <Users className="h-6 w-6" />,
            color: "bg-blue-500",
            href: "/customers",
          },
          {
            title: "Invoices",
            value: invoiceResult.count || 0,
            icon: <Receipt className="h-6 w-6" />,
            color: "bg-green-500",
            href: "/invoices",
          },
          {
            title: "Estimates",
            value: estimateResult.count || 0,
            icon: <FileText className="h-6 w-6" />,
            color: "bg-orange-500",
            href: "/estimates",
          },
          {
            title: "Projects",
            value: projectResult.count || 0,
            icon: <Briefcase className="h-6 w-6" />,
            color: "bg-purple-500",
            href: "/projects",
          },
        ])
      } catch (error) {
        console.error("[v0] Error loading dashboard:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [params.userId, router, toast, supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#08042B]">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-[#08042B]">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 text-white p-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F67721]">
            {user.full_name?.[0] || "U"}
          </div>
          <div>
            <p className="font-semibold">{businessName}</p>
            <p className="text-sm text-gray-400">{user.full_name}</p>
          </div>
        </div>
        <div className="flex justify-around mb-8">
          <Button variant="ghost" size="icon" title="Send Email">
            <Mail className="h-5 w-5" />
          </Button>
          <Link href="/customers">
            <Button variant="ghost" size="icon" title="Customers">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" title="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className={`${stat.color} text-white p-6 hover:opacity-90 transition-opacity cursor-pointer`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="p-6 bg-white/10 border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/customers">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Users className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </Link>
              <Link href="/invoices">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Receipt className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </Link>
              <Link href="/estimates">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <FileText className="h-4 w-4 mr-2" />
                  New Estimate
                </Button>
              </Link>
              <Link href="/projects">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Briefcase className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity Placeholder */}
          <Card className="p-6 bg-white/10 border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white">
                <Activity className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm">Welcome to RedFox CRM!</p>
                  <p className="text-xs text-gray-400">Get started by adding your first customer</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
