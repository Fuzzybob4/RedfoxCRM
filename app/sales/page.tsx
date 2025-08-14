import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
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

interface Invoice {
  id: number
  customer_name: string
  amount: number
  status: string
  due_date: string
}

interface Estimate {
  id: number
  customer_name: string
  amount: number
  status: string
  expiry_date: string
}

interface Project {
  id: number
  name: string
  client: string
  status: string
  deadline: string
}

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <DollarSign className="h-5 w-5" />, label: "Sales", href: "/sales", active: true },
  { icon: <ScrollText className="h-5 w-5" />, label: "Invoices", href: "/invoices" },
  { icon: <FileText className="h-5 w-5" />, label: "Estimates", href: "/estimates" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Projects", href: "/projects" },
  { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/customers" },
  { icon: <BarChart className="h-5 w-5" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
]

export default async function SalesPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile, error } = await supabase.from("profiles").select("access_level").eq("id", user.id).single()

  if (error || !profile) {
    console.error("Error fetching user profile:", error)
    redirect("/dashboard")
  }

  if (profile.access_level === "starter") {
    redirect("/upgrade")
  }

  const { data: invoices } = await supabase.from("invoices").select("*").eq("owner_id", user.id)
  const { data: estimates } = await supabase.from("estimates").select("*").eq("owner_id", user.id)
  const { data: projects } = await supabase.from("projects").select("*").eq("owner_id", user.id)
  const { data: companyProfile } = await supabase
    .from("company_profiles")
    .select("company_name")
    .eq("owner_id", user.id)
    .single()

  const companyName = companyProfile?.company_name || "Company Name"
  const invoiceCount = invoices?.length || 0
  const estimateCount = estimates?.length || 0
  const projectCount = projects?.length || 0

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
              placeholder="Search sales"
              className="bg-[#1a1f2c] border-gray-700 text-white w-full max-w-md"
            />
            <Button className="bg-[#e85d3d] hover:bg-[#d54e2f] text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
            <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              New Estimate
            </Button>
            <Button className="bg-[#2196F3] hover:bg-[#1e87db] text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="flex gap-6 mb-8">
              <Card className="w-[300px] bg-[#e85d3d] text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">TOTAL INVOICES</p>
                      <h2 className="text-4xl font-bold">{invoiceCount}</h2>
                    </div>
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </Card>
              <Card className="w-[300px] bg-[#4CAF50] text-white">
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
              <Card className="w-[300px] bg-[#2196F3] text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">TOTAL PROJECTS</p>
                      <h2 className="text-4xl font-bold">{projectCount}</h2>
                    </div>
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Table */}
            <div className="bg-[#272e3f] rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-white">Invoices</h2>
                  <span className="text-gray-400 text-sm">| {invoiceCount} invoices</span>
                </div>
                <Button variant="ghost" size="icon" className="text-white">
                  <Download className="h-5 w-5" />
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">Invoice ID</TableHead>
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Due Date</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices?.map((invoice: Invoice) => (
                    <TableRow key={invoice.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">INV-{invoice.id}</TableCell>
                      <TableCell className="text-white">{invoice.customer_name}</TableCell>
                      <TableCell className="text-white">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{invoice.status}</TableCell>
                      <TableCell className="text-white">{invoice.due_date}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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

