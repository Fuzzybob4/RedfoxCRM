"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface NavMenuProps {
  mobile?: boolean
}

export function NavMenu({ mobile = false }: NavMenuProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (mobile) {
    return (
      <div className="flex flex-col space-y-2">
        <Link
          href="/features"
          className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          onClick={scrollToTop}
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          onClick={scrollToTop}
        >
          Pricing
        </Link>
        <Link
          href="/industries"
          className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          onClick={scrollToTop}
        >
          Industries
        </Link>
        <Link
          href="/resources"
          className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          onClick={scrollToTop}
        >
          Resources
        </Link>
        <Link
          href="/contact-sales"
          className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          onClick={scrollToTop}
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
          <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-gray-800">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/features"
                    onClick={scrollToTop}
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">All Features</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Discover all the powerful features that make RedFox CRM the perfect choice for your business.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/features/customers" title="Customer Management" onClick={scrollToTop}>
                Organize and track all your customer information in one place.
              </ListItem>
              <ListItem href="/features/analytics" title="Analytics & Reports" onClick={scrollToTop}>
                Get insights into your business performance with detailed analytics.
              </ListItem>
              <ListItem href="/features/communication" title="Communication Tools" onClick={scrollToTop}>
                Stay connected with customers through integrated communication tools.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800",
              )}
              onClick={scrollToTop}
            >
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-gray-800">
            Industries
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="/industries/holiday-lighting" title="Holiday Lighting" onClick={scrollToTop}>
                Specialized CRM features for holiday lighting businesses.
              </ListItem>
              <ListItem href="/industries/outdoor-lighting" title="Outdoor Lighting" onClick={scrollToTop}>
                Manage outdoor lighting projects and customers efficiently.
              </ListItem>
              <ListItem href="/industries/landscaping" title="Landscaping" onClick={scrollToTop}>
                Complete solution for landscaping and lawn care businesses.
              </ListItem>
              <ListItem href="/industries/irrigation" title="Irrigation" onClick={scrollToTop}>
                Streamline irrigation system installations and maintenance.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/resources" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800",
              )}
              onClick={scrollToTop}
            >
              Resources
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact-sales" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800",
              )}
              onClick={scrollToTop}
            >
              Contact Sales
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = ({ className, title, children, href, onClick, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          onClick={onClick}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
