"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/components/auth-provider"
import { Menu, X, LogOut, ChevronDown, Shield, UserCog, User, Eye, Crown } from "lucide-react"
import type { RolePermissions } from "@/lib/supabase"

const navigation: { name: string; href: string; icon: string; feature: keyof RolePermissions }[] = [
  { name: "Dashboard", href: "/dashboard", icon: "/image/icon/dashboard.png", feature: "dashboard" },
  { name: "Customers", href: "/customers", icon: "/image/icon/customers.png", feature: "customers" },
  { name: "Invoices", href: "/invoices", icon: "/image/icon/invoices.png", feature: "invoices" },
  { name: "Estimates", href: "/estimates", icon: "/image/icon/calendar.png", feature: "estimates" },
  { name: "Projects", href: "/projects", icon: "/image/icon/jobs.png", feature: "projects" },
  { name: "Reports", href: "/reports", icon: "/image/icon/reports.png", feature: "reports" },
  { name: "Mapping", href: "/mapping", icon: "/image/icon/map.png", feature: "mapping" },
  { name: "Scheduling", href: "/scheduling", icon: "/image/icon/calendar.png", feature: "scheduling" },
  { name: "Products", href: "/products", icon: "/image/icon/jobs.png", feature: "products" },
  { name: "Sales", href: "/sales", icon: "/image/icon/payments.png", feature: "sales" },
  { name: "Users", href: "/users", icon: "/image/icon/customers.png", feature: "users" },
  { name: "Billing", href: "/billing", icon: "/image/icon/payments.png", feature: "billing" },
  { name: "Settings", href: "/settings", icon: "/image/icon/settings.png", feature: "settings" },
]

const roleBadgeConfig = {
  super_admin: {
    color: "bg-gradient-to-r from-brand-orange to-brand-yellow text-brand-dark",
    icon: Crown,
    label: "Super Admin",
  },
  admin: { color: "bg-destructive text-destructive-foreground", icon: Shield, label: "Admin" },
  manager: { color: "bg-brand-orange text-white", icon: UserCog, label: "Manager" },
  user: { color: "bg-primary text-primary-foreground", icon: User, label: "User" },
  viewer: { color: "bg-muted text-muted-foreground", icon: Eye, label: "Viewer" },
}

export function DashboardSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut, role, hasPermission } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  const filteredNavigation = navigation.filter((item) => hasPermission(item.feature, "canView"))

  const roleConfig = role ? roleBadgeConfig[role] : null
  const RoleIcon = roleConfig?.icon || User

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-background/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-background">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <img className="h-8 w-auto" src="/image/logo/redfox-logo.png" alt="RedFox CRM" />
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* User Profile - Mobile */}
          <div className="p-4 border-b border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src="/image/avatar/default.png" />
                      <AvatarFallback className="bg-brand-orange/10 text-brand-orange">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="text-sm font-medium text-foreground">
                        {user?.name || user?.email?.split("@")[0] || "User"}
                      </div>
                      {roleConfig && (
                        <Badge className={`${roleConfig.color} text-xs mt-1`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleConfig.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {hasPermission("settings", "canView") && (
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                )}
                {hasPermission("admin", "canView") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                {hasPermission("super_admin", "canView") && (
                  <DropdownMenuItem asChild>
                    <Link href="/super-admin/dashboard">Super Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Image
                    src={item.icon || "/placeholder.svg"}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={`mr-3 h-5 w-5 ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-background border-r border-border">
          <div className="flex items-center h-16 px-4 border-b border-border">
            <img className="h-8 w-auto" src="/image/logo/redfox-logo.png" alt="RedFox CRM" />
            <span className="ml-2 text-xl font-bold text-foreground">RedFox CRM</span>
          </div>

          {/* User Profile - Desktop */}
          <div className="p-4 border-b border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-accent">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src="/image/avatar/default.png" />
                      <AvatarFallback className="bg-brand-orange/10 text-brand-orange">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="text-sm font-medium text-foreground">
                        {user?.name || user?.email?.split("@")[0] || "User"}
                      </div>
                      {roleConfig && (
                        <Badge className={`${roleConfig.color} text-xs mt-1`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleConfig.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {hasPermission("settings", "canView") && (
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                )}
                {hasPermission("admin", "canView") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                {hasPermission("super_admin", "canView") && (
                  <DropdownMenuItem asChild>
                    <Link href="/super-admin/dashboard">Super Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Image
                    src={item.icon || "/placeholder.svg"}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={`mr-3 h-5 w-5 ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-background border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <img className="h-8 w-auto" src="/image/logo/redfox-logo.png" alt="RedFox CRM" />
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>
    </>
  )
}
