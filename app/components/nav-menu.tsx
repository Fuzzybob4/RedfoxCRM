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
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Customer Management",
    href: "/features/customers",
    description: "Comprehensive customer profiles and relationship tracking",
  },
  {
    title: "Analytics & Reporting",
    href: "/features/analytics",
    description: "Data-driven insights and performance metrics",
  },
  {
    title: "Communication Tools",
    href: "/features/communication",
    description: "Automated messaging and customer notifications",
  },
  {
    title: "Scheduling & Dispatch",
    href: "/features/scheduling",
    description: "Smart scheduling and crew dispatch management",
  },
  {
    title: "Document Management",
    href: "/features/documents",
    description: "Contracts, invoices, and document storage",
  },
  {
    title: "Security & Compliance",
    href: "/features/security",
    description: "Enterprise-grade security and data protection",
  },
]

const industries = [
  {
    title: "Holiday Lighting",
    href: "/industries/holiday-lighting",
    description: "Seasonal installation and equipment management",
  },
  {
    title: "Outdoor Lighting",
    href: "/industries/outdoor-lighting",
    description: "Year-round landscape lighting solutions",
  },
  {
    title: "Landscaping & Lawn Care",
    href: "/industries/landscaping",
    description: "Complete landscaping operations management",
  },
  {
    title: "Irrigation & Sprinklers",
    href: "/industries/irrigation",
    description: "Water system diagnostics and maintenance",
  },
]

const resources = [
  {
    title: "Help Center",
    href: "/resources#help",
    description: "Get answers to common questions",
  },
  {
    title: "Video Tutorials",
    href: "/resources#videos",
    description: "Step-by-step video guides",
  },
  {
    title: "Templates & Tools",
    href: "/resources#templates",
    description: "Downloadable business templates",
  },
  {
    title: "Community Forum",
    href: "/resources#community",
    description: "Connect with other professionals",
  },
]

interface NavMenuProps {
  mobile?: boolean
}

export function NavMenu({ mobile = false }: NavMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  if (mobile) {
    return (
      <div className="flex flex-col space-y-4">
        {/* Features Dropdown */}
        <div>
          <button
            onClick={() => setOpenDropdown(openDropdown === "features" ? null : "features")}
            className="flex items-center justify-between w-full text-white hover:text-gray-300 transition-colors"
          >
            Features
            <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === "features" && "rotate-180")} />
          </button>
          {openDropdown === "features" && (
            <div className="mt-2 ml-4 space-y-2">
              {features.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {feature.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Industries Dropdown */}
        <div>
          <button
            onClick={() => setOpenDropdown(openDropdown === "industries" ? null : "industries")}
            className="flex items-center justify-between w-full text-white hover:text-gray-300 transition-colors"
          >
            Industries
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", openDropdown === "industries" && "rotate-180")}
            />
          </button>
          {openDropdown === "industries" && (
            <div className="mt-2 ml-4 space-y-2">
              {industries.map((industry) => (
                <Link
                  key={industry.href}
                  href={industry.href}
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {industry.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Resources Dropdown */}
        <div>
          <button
            onClick={() => setOpenDropdown(openDropdown === "resources" ? null : "resources")}
            className="flex items-center justify-between w-full text-white hover:text-gray-300 transition-colors"
          >
            Resources
            <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === "resources" && "rotate-180")} />
          </button>
          {openDropdown === "resources" && (
            <div className="mt-2 ml-4 space-y-2">
              {resources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {resource.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Direct Links */}
        <Link href="/pricing" className="text-white hover:text-gray-300 transition-colors">
          Pricing
        </Link>
      </div>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {features.map((feature) => (
                <ListItem key={feature.title} title={feature.title} href={feature.href}>
                  {feature.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
            Industries
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {industries.map((industry) => (
                <ListItem key={industry.title} title={industry.title} href={industry.href}>
                  {industry.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/10">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {resources.map((resource) => (
                <ListItem key={resource.title} title={resource.title} href={resource.href}>
                  {resource.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white/10 data-[state=open]:bg-white/10">
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
