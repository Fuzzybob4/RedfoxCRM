"use client"

import type React from "react"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface NavMenuProps {
  mobile?: boolean
}

export function NavMenu({ mobile = false }: NavMenuProps) {
  if (mobile) {
    return (
      <div className="space-y-1">
        <Link
          href="/features"
          className="block px-3 py-2 text-base font-medium text-white hover:text-blue-400 hover:bg-gray-700 rounded-md"
        >
          Features
        </Link>
        <Link
          href="/industries"
          className="block px-3 py-2 text-base font-medium text-white hover:text-blue-400 hover:bg-gray-700 rounded-md"
        >
          Industries
        </Link>
        <Link
          href="/pricing"
          className="block px-3 py-2 text-base font-medium text-white hover:text-blue-400 hover:bg-gray-700 rounded-md"
        >
          Pricing
        </Link>
        <Link
          href="/resources"
          className="block px-3 py-2 text-base font-medium text-white hover:text-blue-400 hover:bg-gray-700 rounded-md"
        >
          Resources
        </Link>
        <Link
          href="/contact-sales"
          className="block px-3 py-2 text-base font-medium text-white hover:text-blue-400 hover:bg-gray-700 rounded-md"
        >
          Contact Sales
        </Link>
      </div>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:text-blue-400 data-[state=open]:text-blue-400">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/50 to-blue-700/50 p-6 no-underline outline-none focus:shadow-md"
                    href="/features"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium text-white">All Features</div>
                    <p className="text-sm leading-tight text-blue-100">
                      Comprehensive CRM solution with customer management, invoicing, and analytics.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/features/customers" title="Customer Management">
                Organize and track customer information, interactions, and history.
              </ListItem>
              <ListItem href="/features/analytics" title="Analytics & Reports">
                Gain insights with detailed analytics and customizable reports.
              </ListItem>
              <ListItem href="/features/communication" title="Communication Tools">
                Integrated email, SMS, and notification systems.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:text-blue-400 data-[state=open]:text-blue-400">
            Industries
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/industries/holiday-lighting" title="Holiday Lighting">
                Seasonal lighting installation and maintenance services.
              </ListItem>
              <ListItem href="/industries/outdoor-lighting" title="Outdoor Lighting">
                Landscape and architectural lighting solutions.
              </ListItem>
              <ListItem href="/industries/landscaping" title="Landscaping">
                Complete landscape design and maintenance services.
              </ListItem>
              <ListItem href="/industries/irrigation" title="Irrigation">
                Smart irrigation systems and water management.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:text-blue-400 focus:text-blue-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/resources" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:text-blue-400 focus:text-blue-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              Resources
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact-sales" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:text-blue-400 focus:text-blue-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              Contact Sales
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
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
  },
)
ListItem.displayName = "ListItem"
