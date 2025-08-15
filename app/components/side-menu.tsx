"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact-sales" },
]

export function SideMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary px-4 py-2 rounded-md",
                pathname === item.href ? "text-foreground bg-accent" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t pt-4 mt-8">
            <div className="flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
