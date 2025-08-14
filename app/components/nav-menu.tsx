"use client"

import * as React from "react"
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

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-lg font-semibold bg-black text-white hover:bg-black/90 hover:text-white focus:bg-black/90 focus:text-white">
            Solutions
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">RedFox CRM</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Streamline your business operations with our comprehensive CRM solution.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/features" title="Features">
                Explore our powerful features designed for your industry.
              </ListItem>
              <ListItem href="/pricing" title="Pricing">
                Find the perfect plan for your business needs.
              </ListItem>
              <ListItem href="/sales" title="Contact Sales">
                Get in touch with our sales team for personalized assistance.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-lg font-semibold bg-black text-white hover:bg-black/90 hover:text-white focus:bg-black/90 focus:text-white">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/services/implementation" title="Implementation">
                Expert guidance to get your CRM up and running smoothly.
              </ListItem>
              <ListItem href="/services/training" title="Training">
                Comprehensive training programs for your team.
              </ListItem>
              <ListItem href="/services/support" title="Support">
                24/7 support to ensure your business never skips a beat.
              </ListItem>
              <ListItem href="/services/consulting" title="Consulting">
                Strategic advice to maximize your CRM's potential.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className="text-lg font-semibold bg-black text-white hover:bg-black/90 hover:text-white focus:bg-black/90 focus:text-white px-4 py-2 rounded-md transition-colors duration-200">
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
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

