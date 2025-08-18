"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { NavMenu } from "./nav-menu"
import { LoginDialog } from "./login-dialog"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08042B]/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/redfox-logo-light.png" alt="RedFox CRM" width={40} height={40} className="w-10 h-10" />
            <span className="text-xl font-bold text-white">RedFox CRM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavMenu />
            <Link href="/pricing" className="text-white hover:text-orange-400 transition-colors">
              Pricing
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-500 text-white">
                        {getInitials(user.user_metadata?.full_name || user.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <LoginDialog />
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#F67721] to-[#F5F906] text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <NavMenu mobile />
              <Link
                href="/pricing"
                className="text-white hover:text-orange-400 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>

              {user ? (
                <div className="flex flex-col space-y-2 px-4">
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-orange-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-white hover:text-orange-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="text-white hover:text-orange-400 justify-start px-0"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-4">
                  <LoginDialog mobile onClose={() => setIsMenuOpen(false)} />
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#F67721] to-[#F5F906] text-black font-semibold hover:opacity-90 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
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
  )
}
