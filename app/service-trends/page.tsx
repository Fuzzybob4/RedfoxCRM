"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  LayoutDashboard,
  ScrollText,
  Users,
  BarChartIcon,
  Settings,
  FileText,
  DollarSign,
  Briefcase,
  TrendingUp,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

// Mock data (replace with real data from Supabase later)
const popularServicesData = [
  { name: "Lawn Mowing", bookings: 150, revenue: 3000 },
  { name: "Tree Trimming", bookings: 100, revenue: 5000 },
  { name: "Flower Planting", bookings: 80, revenue: 2000 },
  { name: "Weed Control", bookings: 120, revenue: 2400 },
  { name: "Irrigation", bookings: 60, revenue: 3600 },
]

const revenueByServiceData = [
  { name: "Lawn Care", value: 4000 },
  { name: "Tree Services", value: 3000 },
  { name: "Landscaping", value: 2000 },
  { name: "Pest Control", value: 1500 },
  { name: "Snow Removal", value: 1000 },
]

const seasonalTrendsData = [
  { month: "Jan", lawnCare: 1000, treeServices: 500, landscaping: 200 },
  { month: "Feb", lawnCare: 1200, treeServices: 600, landscaping: 300 },
  { month: "Mar", lawnCare: 1800, treeServices: 900, landscaping: 700 },
  { month: "Apr", lawnCare: 2400, treeServices: 1200, landscaping: 1100 },
  { month: "May", lawnCare: 3000, treeServices: 1500, landscaping: 1500 },
  { month: "Jun", lawnCare: 3200, treeServices: 1600, landscaping: 1600 },
]

const customerPreferencesData = [
  { name: "Lawn Mowing", value: 400 },
  { name: "Tree Trimming", value: 300 },
  { name: "Flower Planting", value: 200 },
  { name: "Weed Control", value: 150 },
  { name: "Irrigation", value: 100 },
]

const averageServiceTimeData = [
  { name: "Lawn Mowing", time: 60 },
  { name: "Tree Trimming", time: 120 },
  { name: "Flower Planting", time: 90 },
  { name: "Weed Control", time: 45 },
  { name: "Irrigation", time: 180 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChartIcon className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <TrendingUp className="h-5 w-5" />, label: "Service Trends", href: "/service-trends", active: true },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default function ServiceTrendsPage() {
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState("Company name")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkAuthAndLoadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      fetchCompanyName(user)
      // Fetch other service trend data here
      setLoading(false)
    }

    checkAuthAndLoadData()
  }, [router])

  async function fetchCompanyName(user: User) {
    if (!user) return

    const { data, error } = await supabase
      .from("company_profiles")
      .select("company_name")
      .eq("owner_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching company name:", error)
    } else if (data && data.company_name) {
      setCompanyName(data.company_name)
    }
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
      </div>

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-[#272e3f] flex items-center px-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Service Trends</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Most Popular Services */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Most Popular Services</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularServicesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue by Service Type */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Revenue by Service Type</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByServiceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueByServiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Seasonal Trends */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Seasonal Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lawnCare" stroke="#8884d8" name="Lawn Care" />
                  <Line type="monotone" dataKey="treeServices" stroke="#82ca9d" name="Tree Services" />
                  <Line type="monotone" dataKey="landscaping" stroke="#ffc658" name="Landscaping" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Customer Preferences */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Customer Preferences</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerPreferencesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerPreferencesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Average Service Completion Time */}
            <Card className="p-6 bg-white/10 border-white/20 col-span-1 lg:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">Average Service Completion Time (minutes)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averageServiceTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
