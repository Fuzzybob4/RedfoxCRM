"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { NavMenu } from "./nav-menu"
import { LoginDialog } from "./login-dialog"
import { useAuth } from "./auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={scrollToTop}>
              <Image src="/image/logo/redfox-logo.png" alt="RedFox CRM" width={40} height={40} className="w-10 h-10" />
              <span className="text-xl font-bold text-white">RedFox CRM</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavMenu />
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-700 rounded-full"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">User</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" onClick={scrollToTop}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" onClick={scrollToTop}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-orange-400"
                  onClick={() => setLoginDialogOpen(true)}
                >
                  Sign In
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/signup" onClick={scrollToTop}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-lg mt-2">
              <NavMenu mobile />
              <div className="pt-4 border-t border-gray-700">
                {loading ? (
                  <div className="w-full h-10 animate-pulse bg-gray-700 rounded"></div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">User</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Button asChild variant="ghost" className="w-full justify-start text-white">
                      <Link href="/dashboard" onClick={scrollToTop}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-white">
                      <Link href="/profile" onClick={scrollToTop}>
                        Profile
                      </Link>
                    </Button>
                    <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-white">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-orange-400"
                      onClick={() => setLoginDialogOpen(true)}
                    >
                      Sign In
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      <Link href="/signup" onClick={scrollToTop}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      <LoginDialog isOpen={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
    </header>
  )
}
