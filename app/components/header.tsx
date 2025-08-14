"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SideMenu } from "./side-menu"
import { useAuth } from "./auth-provider"

export function Header() {
  const { isLoggedIn } = useAuth()

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#F67721] to-[#FFFF00] px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-20 h-20">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03bf7fc8-fb10-405f-8d44-7f4cf9ada575.png%20(1)-EbLykftKwzbq1ybShsTqu4JvXj4z3Y.png"
              alt="RedFox CRM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-white text-4xl font-bold">RedFox CRM</span>
        </Link>
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <Button asChild className="bg-white text-[#08042B] hover:bg-[#F5F906] px-6 py-3 text-lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
          )}
          <SideMenu />
        </div>
      </div>
    </nav>
  )
}
