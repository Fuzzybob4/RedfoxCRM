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

const features = [
  {
    title: "Customer Management",
    href: "/features/customers",
    description: "Centralize customer data and communication history",
  },
  {
    title: "Scheduling & Routing",
    href: "/features/scheduling",
    description: "Optimize routes and manage team schedules",
  },
  {
    title: "Invoicing & Payments",
    href: "/features/invoicing",
    description: "Create invoices and process payments seamlessly",
  },
  {
    title: "Analytics & Reporting",
    href: "/features/analytics",
    description: "Get insights into your business performance",
  },
]

const industries = [
  {
    title: "Landscaping & Lawn Care",
    href: "/industries/landscaping",
    description: "Manage seasonal services and equipment tracking",
  },
  {
    title: "Holiday Lighting",
    href: "/industries/holiday-lighting",
    description: "Track installations and seasonal inventory",
  },
  {
    title: "Property Management",
    href: "/industries/property-management",
    description: "Coordinate properties and maintenance requests",
  },
  {
    title: "Home Services",
    href: "/industries/home-services",
    description: "Manage service calls and technician schedules",
  },
]

interface NavMenuProps {
  mobile?: boolean
}

export function NavMenu({ mobile = false }: NavMenuProps) {
  if (mobile) {
    return (
      <div className="flex flex-col space-y-2">
        <Link href="/features" className="text-gray-700 hover:text-gray-900 py-2">
          Features
        </Link>
        <Link href="/pricing" className="text-gray-700 hover:text-gray-900 py-2">
          Pricing
        </Link>
        <Link href="/industries" className="text-gray-700 hover:text-gray-900 py-2">
          Industries
        </Link>
        <Link href="/resources" className="text-gray-700 hover:text-gray-900 py-2">
          Resources
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-gray-900 py-2">
          Contact
        </Link>
      </div>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
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
          <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
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
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/resources" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              Resources
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              Contact
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
