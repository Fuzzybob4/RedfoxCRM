"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreVertical,
  Download,
  LayoutDashboard,
  ScrollText,
  Users,
  BarChart,
  Settings,
  UserPlus,
  FileText,
  DollarSign,
  Briefcase,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@supabase/supabase-js"

interface Estimate {
  id: number
  customer_name: string
  amount: number
  status: string
  expiry_date: string
}

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales" },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates", active: true },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChart className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default function EstimatesPage() {
  const [estimateCount, setEstimateCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [estimates, setEstimates] = useState<Estimate[]>([])
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
      fetchEstimates(user)
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

  async function fetchEstimates(user: User) {
    if (!user) {
      console.error("No user found")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from("estimates").select("*").eq("owner_id", user.id)

    if (error) {
      console.error("Error fetching estimates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch estimates. Please try again.",
        variant: "destructive",
      })
    } else {
      setEstimates(data)
      setEstimateCount(data.length)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-64 bg-card text-muted-foreground border-r border-border">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">{companyName}</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                ${item.active ? "bg-accent text-foreground" : "hover:bg-accent/50 hover:text-foreground"}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Top Search Bar */}
        <div className="h-16 bg-card flex items-center px-4 border-b border-border">
          <div className="flex-1 flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search estimates"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border text-foreground w-full max-w-md"
            />
            <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              New Estimate
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="flex gap-6 mb-8">
              <Card className="w-[300px] bg-success text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">TOTAL ESTIMATES</p>
                      <h2 className="text-4xl font-bold">{estimateCount}</h2>
                    </div>
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Estimates Table */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-foreground">Estimates</h2>
                  <span className="text-muted-foreground text-sm">| {estimateCount} Estimates</span>
                </div>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Download className="h-5 w-5" />
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Estimate ID</TableHead>
                    <TableHead className="text-muted-foreground">Customer</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimates.map((estimate) => (
                    <TableRow key={estimate.id} className="border-border">
                      <TableCell className="font-medium text-foreground">EST-{estimate.id}</TableCell>
                      <TableCell className="text-foreground">{estimate.customer_name}</TableCell>
                      <TableCell className="text-foreground">${estimate.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-foreground">{estimate.status}</TableCell>
                      <TableCell className="text-foreground">{estimate.expiry_date}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
