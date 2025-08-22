"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Suspense } from "react"

function LoginFormContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()
  const sp = useSearchParams()
  const message = sp.get("message")

  // Improved test mode bypass - simple local auth for testing
  const handleTestLogin = (email: string, password: string): boolean => {
    const testCredentials = [
      { email: "demo@example.com", password: "demo123", userId: "demo-user-123", name: "Demo User" },
      { email: "john@example.com", password: "john123", userId: "john-doe-456", name: "John Doe" },
      { email: "jane@example.com", password: "jane123", userId: "jane-smith-789", name: "Jane Smith" },
      { email: "test@example.com", password: "test123", userId: "test-user-001", name: "Test User" },
    ]

    const validCredential = testCredentials.find((cred) => cred.email === email && cred.password === password)

    if (validCredential) {
      const testSession = {
        userId: validCredential.userId,
        email: validCredential.email,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }

      // Set test session in localStorage
      localStorage.setItem("test-auth-session", JSON.stringify(testSession))

      // Set test session as cookie for middleware
      const cookieValue = encodeURIComponent(JSON.stringify(testSession))
      document.cookie = `test-auth-session=${cookieValue}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`

      console.log("Test session created for:", validCredential.email)
      return true
    }

    return false
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      // Try test login first
      if (handleTestLogin(email, password)) {
        // Force a full page navigation to ensure auth state is properly set
        const redirectTo = sp.get("redirectedFrom") || "/dashboard"
        console.log("Redirecting to:", redirectTo)
        window.location.href = redirectTo
        return
      }

      // If test login fails, try Supabase
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setErrorMsg(error.message)
          return
        }

        await supabase.auth.getSession()
        const redirectTo = sp.get("redirectedFrom") || "/dashboard"
        window.location.href = redirectTo
      } catch (err) {
        console.error("Supabase login error:", err)
        setErrorMsg("Invalid credentials. Please check your email and password.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setErrorMsg("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMsg("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${sp.get("redirectedFrom") || "/dashboard"}`,
        },
      })

      if (error) {
        setErrorMsg(error.message || "Failed to sign in with Google")
        setLoading(false)
      }
    } catch (err) {
      console.error("Google sign in error:", err)
      setErrorMsg("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Google Sign In Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading ? "Signing in..." : "Continue with Google"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/signup")}>
            Sign up
          </Button>
        </p>
      </div>
    </div>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  )
}
