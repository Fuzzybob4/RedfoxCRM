"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface NavMenuProps {
  mobile?: boolean
}

export function NavMenu({ mobile = false }: NavMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const features = [
    {
      title: "Customer Management",
      href: "/features/customers",
      description: "Organize and track all your customer information in one place",
    },
    {
      title: "Analytics & Reporting",
      href: "/features/analytics",
      description: "Get insights into your business performance and growth",
    },
    {
      title: "Communication Tools",
      href: "/features/communication",
      description: "Stay connected with customers through integrated messaging",
    },
    {
      title: "Scheduling & Calendar",
      href: "/features/scheduling",
      description: "Manage appointments and optimize your team's schedule",
    },
    {
      title: "Document Management",
      href: "/features/documents",
      description: "Store and organize contracts, invoices, and important files",
    },
    {
      title: "Security & Compliance",
      href: "/features/security",
      description: "Enterprise-grade security to protect your business data",
    },
  ]

  const industries = [
    {
      title: "Holiday Lighting",
      href: "/industries/holiday-lighting",
      description: "Seasonal installation and maintenance management",
    },
    {
      title: "Outdoor Lighting",
      href: "/industries/outdoor-lighting",
      description: "Permanent landscape and architectural lighting",
    },
    {
      title: "Landscaping & Lawn Care",
      href: "/industries/landscaping",
      description: "Complete lawn and landscape service management",
    },
    {
      title: "Irrigation & Sprinklers",
      href: "/industries/irrigation",
      description: "Sprinkler system installation and maintenance",
    },
  ]

  if (mobile) {
    return (
      <div className="flex flex-col space-y-4">
        <div>
          <button
            className="flex items-center justify-between w-full text-white hover:text-orange-400 transition-colors px-4 py-2"
            onClick={() => setOpenDropdown(openDropdown === "features" ? null : "features")}
          >
            Features
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openDropdown === "features" ? "rotate-180" : ""}`}
            />
          </button>
          {openDropdown === "features" && (
            <div className="pl-4 mt-2 space-y-2">
              {features.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="block text-gray-300 hover:text-orange-400 transition-colors py-1"
                >
                  {feature.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            className="flex items-center justify-between w-full text-white hover:text-orange-400 transition-colors px-4 py-2"
            onClick={() => setOpenDropdown(openDropdown === "industries" ? null : "industries")}
          >
            Industries
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openDropdown === "industries" ? "rotate-180" : ""}`}
            />
          </button>
          {openDropdown === "industries" && (
            <div className="pl-4 mt-2 space-y-2">
              {industries.map((industry) => (
                <Link
                  key={industry.href}
                  href={industry.href}
                  className="block text-gray-300 hover:text-orange-400 transition-colors py-1"
                >
                  {industry.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/resources" className="text-white hover:text-orange-400 transition-colors px-4 py-2">
          Resources
        </Link>
      </div>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:text-orange-400 data-[state=open]:text-orange-400">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
              {features.map((feature) => (
                <NavigationMenuLink key={feature.href} asChild>
                  <Link
                    href={feature.href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{feature.title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{feature.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:text-orange-400 data-[state=open]:text-orange-400">
            Industries
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
              {industries.map((industry) => (
                <NavigationMenuLink key={industry.href} asChild>
                  <Link
                    href={industry.href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{industry.title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{industry.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/resources"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:text-orange-400 focus:text-orange-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Resources
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
