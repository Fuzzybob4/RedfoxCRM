"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"

export function LoginDialog() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { setIsLoggedIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (!data.user) {
        throw new Error("No user data returned")
      }

      // Ensure session is set
      const { data: sessionData } = await supabase.auth.getSession()

      if (sessionData.session) {
        console.log("Session established:", sessionData.session)
        setIsLoggedIn(true)
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        })
        setOpen(false)

        // Use replace instead of push to avoid navigation issues
        router.refresh() // Refresh to update server components
        router.replace(`/dashboard/${data.user.id}`)
      } else {
        throw new Error("Failed to establish session")
      }
    } catch (err) {
      console.error("Login error:", err)
      toast({
        title: "Login Failed",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white text-[#08042B] hover:bg-[#F5F906] px-6 py-3 text-lg">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#08042B] text-white">
        <DialogHeader>
          <DialogTitle>Login to RedFox CRM</DialogTitle>
          <DialogDescription>Enter your email and password to access your account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <Link
            href="/reset-password"
            className="text-[#F67721] hover:text-[#F5F906] block"
            onClick={() => setOpen(false)}
          >
            Forgot your password?
          </Link>
          <Link href="/login" className="text-[#F67721] hover:text-[#F5F906] block" onClick={() => setOpen(false)}>
            Go to full login page
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
