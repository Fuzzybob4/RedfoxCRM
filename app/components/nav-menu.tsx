"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const featuresLinks = [
  { name: "Customer Management", href: "/features/customers", description: "Organize and track customer interactions" },
  { name: "Sales Analytics", href: "/features/analytics", description: "Get insights into sales performance" },
  { name: "Communication Hub", href: "/features/communication", description: "Streamline customer communications" },
  { name: "Task Scheduling", href: "/features/scheduling", description: "Automated scheduling and reminders" },
  { name: "Document Management", href: "/features/documents", description: "Store and organize documents" },
  { name: "Data Security", href: "/features/security", description: "Enterprise-grade security features" },
]

const industriesLinks = [
  { name: "Holiday Lighting", href: "/industries/holiday-lighting", description: "Seasonal lighting installations" },
  { name: "Outdoor Lighting", href: "/industries/outdoor-lighting", description: "Year-round landscape lighting" },
  { name: "Landscaping", href: "/industries/landscaping", description: "Lawn care and landscaping services" },
  { name: "Irrigation", href: "/industries/irrigation", description: "Sprinkler systems and water management" },
]

const resourcesLinks = [
  { name: "Knowledge Base", href: "/resources/knowledge-base", description: "Guides and documentation" },
  { name: "Video Tutorials", href: "/resources/videos", description: "Step-by-step video guides" },
  { name: "Templates & Tools", href: "/resources/templates", description: "Ready-to-use templates" },
  { name: "Community", href: "/resources/community", description: "Connect with other users" },
  { name: "Support Center", href: "/resources/support", description: "Get help when you need it" },
  { name: "Downloads", href: "/resources/downloads", description: "Apps and integrations" },
]

interface NavMenuProps {
  mobile?: boolean
}

export function NavMenu({ mobile = false }: NavMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  if (mobile) {
    return (
      <div className="flex flex-col space-y-4">
        <div>
          <button
            className="flex items-center justify-between w-full text-white hover:text-[#F5F906] transition-colors py-2"
            onClick={() => setOpenDropdown(openDropdown === "features" ? null : "features")}
          >
            Features
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openDropdown === "features" ? "rotate-180" : ""}`}
            />
          </button>
          {openDropdown === "features" && (
            <div className="pl-4 mt-2 space-y-2">
              {featuresLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-[#F5F906] transition-colors py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            className="flex items-center justify-between w-full text-white hover:text-[#F5F906] transition-colors py-2"
            onClick={() => setOpenDropdown(openDropdown === "industries" ? null : "industries")}
          >
            Industries
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openDropdown === "industries" ? "rotate-180" : ""}`}
            />
          </button>
          {openDropdown === "industries" && (
            <div className="pl-4 mt-2 space-y-2">
              {industriesLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-[#F5F906] transition-colors py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/pricing" className="text-white hover:text-[#F5F906] transition-colors py-2">
          Pricing
        </Link>

        <div>
          <button
            className="flex items-center justify-between w-full text-white hover:text-[#F5F906] transition-colors py-2"
            onClick={() => setOpenDropdown(openDropdown === "resources" ? null : "resources")}
          >
            Resources
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openDropdown === "resources" ? "rotate-180" : ""}`}
            />
          </button>
          {openDropdown === "resources" && (
            <div className="pl-4 mt-2 space-y-2">
              {resourcesLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-[#F5F906] transition-colors py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/contact-sales" className="text-white hover:text-[#F5F906] transition-colors py-2">
          Contact Sales
        </Link>
      </div>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-6">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-[#F5F906] bg-transparent">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
              {featuresLinks.map((link) => (
                <NavigationMenuLink key={link.name} asChild>
                  <Link
                    href={link.href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{link.name}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{link.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-[#F5F906] bg-transparent">
            Industries
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] gap-3 p-6 md:grid-cols-2">
              {industriesLinks.map((link) => (
                <NavigationMenuLink key={link.name} asChild>
                  <Link
                    href={link.href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{link.name}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{link.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/pricing" className="text-white hover:text-[#F5F906] transition-colors">
              Pricing
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-[#F5F906] bg-transparent">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
              {resourcesLinks.map((link) => (
                <NavigationMenuLink key={link.name} asChild>
                  <Link
                    href={link.href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{link.name}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{link.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/contact-sales" className="text-white hover:text-[#F5F906] transition-colors">
              Contact Sales
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
