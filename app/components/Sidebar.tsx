"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  MapPin,
  Briefcase,
  BarChart3,
  CreditCard,
  Settings,
  Menu,
  X,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Scheduling", href: "/scheduling", icon: Calendar },
  { name: "Mapping", href: "/mapping", icon: MapPin },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Estimates", href: "/estimates", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-background/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-background">
          <div className="flex h-16 items-center justify-between px-4">
            <img className="h-8 w-auto" src="/image/logo/redfox-logo.png" alt="RedFox CRM" />
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-brand-orange/10 text-brand-orange"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive ? "text-brand-orange" : "text-muted-foreground group-hover:text-accent-foreground"
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-background border-r border-border">
          <div className="flex items-center h-16 px-4">
            <img className="h-8 w-auto" src="/image/logo/redfox-logo.png" alt="RedFox CRM" />
          </div>
          <ScrollArea className="flex-1">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-brand-orange/10 text-brand-orange"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive ? "text-brand-orange" : "text-muted-foreground group-hover:text-accent-foreground"
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-background border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <img className="h-8 w-auto" src="/image/logo/redfox-logo.png" alt="RedFox CRM" />
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>
    </>
  )
}
