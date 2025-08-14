"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LayoutDashboard,
  ScrollText,
  Users,
  BarChart,
  Settings,
  UserPlus,
  FileText,
  DollarSign,
  Briefcase,
  ShoppingBag,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

interface Order {
  id: string
  customer_name: string
  service_type: string
  amount: number
  status: string
  order_date: string
}

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <ShoppingBag className="h-5 w-5" />, label: "Orders", href: "/orders", active: true },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChart className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
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
      fetchOrders(user)
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

  async function fetchOrders(user: User) {
    if (!user) {
      console.error("No user found")
      setLoading(false)
      return
    }

    // Mock data for now - replace with actual Supabase query
    const mockOrders: Order[] = [
      {
        id: "1",
        customer_name: "John Doe",
        service_type: "Lawn Mowing",
        amount: 150,
        status: "Completed",
        order_date: "2024-01-15",
      },
      {
        id: "2",
        customer_name: "Jane Smith",
        service_type: "Tree Trimming",
        amount: 300,
        status: "In Progress",
        order_date: "2024-01-14",
      },
    ]

    setOrders(mockOrders)
    setLoading(false)
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
            <Input
              type="search"
              placeholder="Search orders"
              className="bg-[#1a1f2c] border-gray-700 text-white w-full max-w-md"
            />
            <Button className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="flex gap-6 mb-8">
              <Card className="w-[300px] bg-[#4CAF50] text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">TOTAL ORDERS</p>
                      <h2 className="text-4xl font-bold">{orders.length}</h2>
                    </div>
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Orders Table */}
            <div className="bg-[#272e3f] rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-white">Orders</h2>
                  <span className="text-gray-400 text-sm">| {orders.length} orders</span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Order ID</TableHead>
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Service</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">ORD-{order.id}</TableCell>
                      <TableCell className="text-white">{order.customer_name}</TableCell>
                      <TableCell className="text-white">{order.service_type}</TableCell>
                      <TableCell className="text-white">${order.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{order.status}</TableCell>
                      <TableCell className="text-white">{order.order_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
