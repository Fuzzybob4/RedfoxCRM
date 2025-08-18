"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/profile" },
  { name: "Customers", href: "/customers" },
  { name: "Invoices", href: "/invoices" },
  { name: "Estimates", href: "/estimates" },
  { name: "Projects", href: "/projects" },
  { name: "Reports", href: "/reports" },
  { name: "Mapping", href: "/mapping" },
  { name: "Scheduling", href: "/scheduling" },
  { name: "Products", href: "/products" },
  { name: "Sales", href: "/sales" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r min-h-screen p-4 bg-white">
      <div className="flex items-center space-x-3 mb-6">
        <Image src="/redfox-logo-light.png" alt="RedFox CRM" width={32} height={32} className="w-8 h-8" />
        <h1 className="font-semibold text-lg text-gray-900">RedFox CRM</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-orange-100 text-orange-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
