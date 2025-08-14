"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "../components/auth-provider"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const { setIsLoggedIn } = useAuth()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")
  const message = searchParams.get("message")

  // Show verification message if redirected from signup
  useEffect(() => {
    if (message) {
      toast({
        title: "Account Created! 📧",
        description: message,
      })
    }
  }, [message, toast])

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

      // Verify session is established
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!sessionData.session) {
        throw new Error("Session not established")
      }

      // Add detailed session debug logging
      console.debug("Login successful:", {
        userId: data.user.id,
        session: {
          expiresAt: new Date(sessionData.session.expires_at! * 1000).toISOString(),
          provider: sessionData.session.provider,
        },
        timestamp: new Date().toISOString(),
      })

      setIsLoggedIn(true)
      toast({
        title: "Login Successful",
        description: "Welcome back to RedFox CRM!",
      })

      // Force a router refresh to update auth state
      router.refresh()

      // Use router.replace to avoid navigation history issues
      const redirectPath = redirectTo || `/dashboard/${data.user.id}`
      router.replace(redirectPath)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-xl text-gray-300">Log in to your RedFox CRM account</p>
      </div>

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <Link href="/reset-password" className="text-[#F67721] hover:text-[#F5F906] transition-colors">
          Forgot your password?
        </Link>
      </div>

      <div className="text-center text-gray-300">
        Don't have an account?{" "}
        <Link href="/signup" className="text-[#F67721] hover:text-[#F5F906] transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  )
}
