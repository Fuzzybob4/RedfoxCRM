"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "/image/icon/dashboard.png",
    fallbackIcon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: "/image/icon/customers.png",
    fallbackIcon: Users,
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: "/image/icon/invoices.png",
    fallbackIcon: FileText,
  },
  {
    name: "Estimates",
    href: "/estimates",
    icon: "/image/icon/calendar.png",
    fallbackIcon: Calendar,
  },
  {
    name: "Scheduling",
    href: "/scheduling",
    icon: "/image/icon/calendar.png",
    fallbackIcon: Calendar,
  },
  {
    name: "Mapping",
    href: "/mapping",
    icon: "/image/icon/map.png",
    fallbackIcon: MapPin,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: "/image/icon/jobs.png",
    fallbackIcon: Briefcase,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: "/image/icon/reports.png",
    fallbackIcon: BarChart3,
  },
  {
    name: "Sales",
    href: "/sales",
    icon: "/image/icon/payments.png",
    fallbackIcon: CreditCard,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "/image/icon/settings.png",
    fallbackIcon: Settings,
  },
]

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 min-h-screen bg-[#1a1f2c] border-r border-gray-800", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Image
              src="/image/logo/redfox-logo-light.png"
              alt="RedFox CRM"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-white">RedFox CRM</span>
          </Link>
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">Navigation</h2>
            <ScrollArea className="h-[400px] px-1">
              <div className="space-y-1 p-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const FallbackIcon = item.fallbackIcon

                  return (
                    <Button
                      key={item.name}
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-white hover:text-white hover:bg-gray-700",
                        isActive && "bg-gray-700 text-white",
                      )}
                    >
                      <Link href={item.href} className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-5 h-5">
                          <Image
                            src={item.icon || "/placeholder.svg"}
                            alt={item.name}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                            onError={(e) => {
                              // Fallback to Lucide icon if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              const parent = target.parentElement
                              if (parent) {
                                const fallback = document.createElement("div")
                                fallback.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/></svg>`
                                parent.appendChild(fallback)
                              }
                            }}
                          />
                          <FallbackIcon className="w-5 h-5 hidden" />
                        </div>
                        <span>{item.name}</span>
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
