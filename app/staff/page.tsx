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
  Users2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

interface StaffMember {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
}

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <Users2 className="h-5 w-5" />, label: "Staff", href: "/staff", active: true },
  { icon: <BarChart className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
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
      fetchStaff(user)
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

  async function fetchStaff(user: User) {
    if (!user) {
      console.error("No user found")
      setLoading(false)
      return
    }

    // Mock data for now - replace with actual Supabase query
    const mockStaff: StaffMember[] = [
      {
        id: "1",
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@company.com",
        role: "Manager",
        status: "Active",
      },
      {
        id: "2",
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@company.com",
        role: "Technician",
        status: "Active",
      },
    ]

    setStaff(mockStaff)
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
              placeholder="Search staff"
              className="bg-[#1a1f2c] border-gray-700 text-white w-full max-w-md"
            />
            <Button className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="flex gap-6 mb-8">
              <Card className="w-[300px] bg-[#2196F3] text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">TOTAL STAFF</p>
                      <h2 className="text-4xl font-bold">{staff.length}</h2>
                    </div>
                    <Users2 className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Staff Table */}
            <div className="bg-[#272e3f] rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-white">Staff Members</h2>
                  <span className="text-gray-400 text-sm">| {staff.length} members</span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell className="text-white">{member.email}</TableCell>
                      <TableCell className="text-white">{member.role}</TableCell>
                      <TableCell className="text-white">{member.status}</TableCell>
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
