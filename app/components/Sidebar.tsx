"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard } from "lucide-react"

export function Sidebar({ userId }: { userId: string }) {
  const pathname = usePathname()

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      href: `/dashboard/${userId}`,
    },
    // ... other nav items
  ]

  return (
    <nav>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors
            ${pathname === item.href ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
