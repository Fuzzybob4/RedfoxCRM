"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

// Mock data (replace with real data from Supabase later)
const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 5500 },
]

const outstandingPayments = [
  { id: 1, customer: "John Doe", amount: 1500, dueDate: "2023-07-15" },
  { id: 2, customer: "Jane Smith", amount: 2000, dueDate: "2023-07-20" },
  { id: 3, customer: "Bob Johnson", amount: 1000, dueDate: "2023-07-25" },
]

const refundsAdjustments = [
  { id: 1, customer: "Alice Brown", amount: -500, date: "2023-06-10", reason: "Overpayment" },
  { id: 2, customer: "Charlie Davis", amount: -750, date: "2023-06-15", reason: "Service issue" },
]

const growthData = [
  { year: 2020, revenue: 50000, customers: 100 },
  { year: 2021, revenue: 75000, customers: 150 },
  { year: 2022, revenue: 100000, customers: 200 },
  { year: 2023, revenue: 125000, customers: 250 },
]

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChartIcon className="h-5 w-5" />, label: "Reports", href: "/reports", active: true },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState("Company name")
  const [revenueBreakdownType, setRevenueBreakdownType] = useState("month")
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
      // Fetch other report data here
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
        {/* Top Search Bar */}
        <div className="h-16 bg-[#272e3f] flex items-center px-4 border-b border-gray-700">
          <div className="flex-1 flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Reports</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Revenue Breakdown */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Revenue Breakdown</h2>
              <div className="mb-4">
                <Select value={revenueBreakdownType} onValueChange={setRevenueBreakdownType}>
                  <SelectTrigger className="w-[180px] bg-[#1a1f2c] border-gray-700 text-white">
                    <SelectValue placeholder="Select breakdown type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">By Month</SelectItem>
                    <SelectItem value="year">By Year</SelectItem>
                    <SelectItem value="service">By Service Type</SelectItem>
                    <SelectItem value="customer">By Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Outstanding Payments */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Outstanding Payments</h2>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstandingPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{payment.customer}</TableCell>
                      <TableCell className="text-white">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{payment.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Refunds & Adjustments */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Refunds & Adjustments</h2>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundsAdjustments.map((item) => (
                    <TableRow key={item.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">{item.customer}</TableCell>
                      <TableCell className="text-white">${item.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{item.date}</TableCell>
                      <TableCell className="text-white">{item.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Year-over-Year Growth */}
            <Card className="p-6 bg-white/10 border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Year-over-Year Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

