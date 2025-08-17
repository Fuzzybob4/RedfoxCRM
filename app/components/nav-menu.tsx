"use client"

import Link from "next/link"
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
  if (mobile) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <div className="text-white font-medium">Features</div>
          <div className="pl-4 space-y-2">
            <Link href="/features/customers" className="block text-white/80 hover:text-white text-sm">
              Customer Management
            </Link>
            <Link href="/features/scheduling" className="block text-white/80 hover:text-white text-sm">
              Scheduling & Dispatch
            </Link>
            <Link href="/features/analytics" className="block text-white/80 hover:text-white text-sm">
              Analytics & Reports
            </Link>
            <Link href="/features/communication" className="block text-white/80 hover:text-white text-sm">
              Communication Tools
            </Link>
            <Link href="/features/documents" className="block text-white/80 hover:text-white text-sm">
              Document Management
            </Link>
            <Link href="/features/security" className="block text-white/80 hover:text-white text-sm">
              Security & Compliance
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-white font-medium">Industries</div>
          <div className="pl-4 space-y-2">
            <Link href="/industries/holiday-lighting" className="block text-white/80 hover:text-white text-sm">
              Holiday Lighting
            </Link>
            <Link href="/industries/outdoor-lighting" className="block text-white/80 hover:text-white text-sm">
              Outdoor Lighting
            </Link>
            <Link href="/industries/landscaping" className="block text-white/80 hover:text-white text-sm">
              Landscaping
            </Link>
            <Link href="/industries/irrigation" className="block text-white/80 hover:text-white text-sm">
              Irrigation
            </Link>
          </div>
        </div>
        <Link href="/pricing" className="text-white hover:text-white/80">
          Pricing
        </Link>
        <Link href="/resources" className="text-white hover:text-white/80">
          Resources
        </Link>
      </div>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
              <NavigationMenuLink asChild>
                <Link
                  href="/features/customers"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Customer Management</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Comprehensive customer profiles and relationship tracking
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/features/scheduling"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Scheduling & Dispatch</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Smart scheduling and crew dispatch optimization
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/features/analytics"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Analytics & Reports</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Business insights and performance analytics
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/features/communication"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Communication Tools</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Automated messaging and customer communication
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/features/documents"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Document Management</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Digital contracts, invoices, and document storage
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/features/security"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Security & Compliance</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Enterprise-grade security and compliance features
                  </p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
            Industries
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
              <NavigationMenuLink asChild>
                <Link
                  href="/industries/holiday-lighting"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Holiday Lighting</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Seasonal installation, maintenance, and takedown management
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/industries/outdoor-lighting"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Outdoor Lighting</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Permanent lighting design, installation, and maintenance
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/industries/landscaping"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Landscaping</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Complete landscaping and lawn care service management
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/industries/irrigation"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Irrigation</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Sprinkler system installation, maintenance, and monitoring
                  </p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/resources" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              Resources
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
