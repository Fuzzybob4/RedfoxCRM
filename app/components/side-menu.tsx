"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoginDialog } from "./login-dialog"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"
import { Menu, MessageCircle, Settings, LogOut, Bell, HelpCircle, User, LayoutDashboard, Users2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DialogDescription } from "@/components/ui/dialog"

export function SideMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { user, isLoggedIn, setIsLoggedIn } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    setOpen(false)
  }

  // Menu items for logged-in users
  const authenticatedMenuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <Users2 className="h-5 w-5" />, label: "Staff", href: "/staff" },
    { icon: <MessageCircle className="h-5 w-5" />, label: "Messages", href: "/messages" },
    { icon: <Bell className="h-5 w-5" />, label: "Notifications", href: "/notifications" },
    { icon: <User className="h-5 w-5" />, label: "Profile", href: "/profile" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
    { icon: <HelpCircle className="h-5 w-5" />, label: "Help & Support", href: "/support" },
  ]

  // Menu items for non-authenticated users
  const publicMenuItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact Sales", href: "/contact-sales" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-black hover:bg-black/10 p-2" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] bg-black text-white"
        aria-describedby="side-menu-description"
      >
        <DialogDescription id="side-menu-description" className="sr-only">
          Navigation menu for RedFox CRM
        </DialogDescription>
        {isLoggedIn ? (
          <nav className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} alt={user?.first_name} />
                <AvatarFallback>{user?.first_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            {authenticatedMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-lg font-semibold hover:text-[#F67721] transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white justify-start text-lg font-semibold mt-4"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </nav>
        ) : (
          <nav className="flex flex-col gap-4 mt-8">
            {publicMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-semibold hover:text-[#F67721] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <LoginDialog onLoginSuccess={() => setIsLoggedIn(true)} />
          </nav>
        )}
      </SheetContent>
    </Sheet>
  )
}

