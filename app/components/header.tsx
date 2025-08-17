"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/app/components/auth-provider"
import { LoginDialog } from "@/app/components/login-dialog"
import { NavMenu } from "@/app/components/nav-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { user, loading, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08042B]/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image src="/redfox-logo-light.png" alt="RedFox CRM Logo" fill className="object-contain" priority />
              </div>
              <span className="text-xl font-bold text-white">RedFox CRM</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavMenu />
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-20 h-9 bg-white/10 animate-pulse rounded"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-[#F67721] to-[#F5F906] text-white">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center space-x-4">
                  <Button
                    onClick={() => setShowLoginDialog(true)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Sign In
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white border-0"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-white/10">
              <div className="flex flex-col space-y-4">
                <NavMenu mobile />
                {!user && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => setShowLoginDialog(true)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent justify-start"
                    >
                      Sign In
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white justify-start"
                    >
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  )
}
