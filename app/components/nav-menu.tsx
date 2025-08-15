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
        <Link href="/features" className="text-white hover:text-blue-300 transition-colors">
          Features
        </Link>
        <Link href="/pricing" className="text-white hover:text-blue-300 transition-colors">
          Pricing
        </Link>
        <Link href="/about" className="text-white hover:text-blue-300 transition-colors">
          About
        </Link>
        <Link href="/contact" className="text-white hover:text-blue-300 transition-colors">
          Contact
        </Link>
      </div>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-blue-300 bg-transparent">
            Solutions
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/20 to-purple-500/20 p-6 no-underline outline-none focus:shadow-md"
                    href="/solutions"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium text-white">Industry Solutions</div>
                    <p className="text-sm leading-tight text-gray-300">
                      Specialized CRM tools for your specific business needs.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              <div className="space-y-2">
                <NavigationMenuLink asChild>
                  <Link
                    href="/solutions/landscaping"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                  >
                    <div className="text-sm font-medium leading-none text-white">Landscaping</div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-300">
                      Route optimization and crew management
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/solutions/holiday-lighting"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                  >
                    <div className="text-sm font-medium leading-none text-white">Holiday Lighting</div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-300">
                      Seasonal scheduling and installation tracking
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/features" className="text-white hover:text-blue-300 transition-colors px-4 py-2">
            Features
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" className="text-white hover:text-blue-300 transition-colors px-4 py-2">
            Pricing
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-blue-300 bg-transparent">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="text-sm font-medium leading-none text-white">Blog</div>
                  <p className="line-clamp-2 text-sm leading-snug text-gray-300">Latest insights and best practices</p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/help"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="text-sm font-medium leading-none text-white">Help Center</div>
                  <p className="line-clamp-2 text-sm leading-snug text-gray-300">Get support and find answers</p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/docs"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="text-sm font-medium leading-none text-white">Documentation</div>
                  <p className="line-clamp-2 text-sm leading-snug text-gray-300">API docs and integration guides</p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10"
                >
                  <div className="text-sm font-medium leading-none text-white">Contact Sales</div>
                  <p className="line-clamp-2 text-sm leading-snug text-gray-300">Talk to our sales team</p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
