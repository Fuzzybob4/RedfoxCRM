"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calculator,
  FolderOpen,
  BarChart3,
  User,
  Map,
  Calendar,
  Package,
  TrendingUp,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Estimates", href: "/estimates", icon: Calculator },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Mapping", href: "/mapping", icon: Map },
  { name: "Scheduling", href: "/scheduling", icon: Calendar },
  { name: "Products", href: "/products", icon: Package },
  { name: "Sales", href: "/sales", icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <Image src="/redfox-logo-light.png" alt="RedFox CRM" width={32} height={32} className="w-8 h-8" />
          <span className="text-xl font-bold text-slate-900">RedFox CRM</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.user_metadata?.full_name || user?.email || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button onClick={signOut} variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
