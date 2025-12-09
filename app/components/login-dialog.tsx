"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { mockAuth } from "@/lib/supabase"

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("[v0] Attempting sign in for:", email)

    try {
      const { data, error } = await mockAuth.signIn(email, password)

      console.log("[v0] Sign in result:", { user: data?.user, error })

      if (error || !data.user) {
        toast({
          title: "Error",
          description: error?.message || "Invalid email or password",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      console.log("[v0] User signed in successfully:", data.user)
      console.log("[v0] User role:", data.user.role)
      console.log("[v0] Cookie set, redirecting to /dashboard")

      toast({
        title: "Success",
        description: `Signed in as ${data.user.name} (${data.user.role})`,
      })

      onClose()

      setTimeout(() => {
        window.location.replace("/dashboard")
      }, 100)
    } catch (error) {
      console.error("[v0] Sign in error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Reset Email Sent",
        description: `If an account exists for ${email}, you will receive a password reset link shortly.`,
      })

      setIsForgotPassword(false)
      setEmail("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsForgotPassword(false)
    setEmail("")
    setPassword("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            {isForgotPassword ? "Reset Password" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {isForgotPassword
              ? "Enter your email to receive a password reset link"
              : "Enter your credentials to access your dashboard"}
          </DialogDescription>
        </DialogHeader>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-foreground">
                Email
              </Label>
              <Input
                id="reset-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                tabIndex={0}
                className="bg-background/50 border-border focus:border-brand-orange focus:ring-brand-orange text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-orange to-brand-yellow hover:opacity-90 text-brand-dark transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Sign In
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                tabIndex={0}
                className="bg-background/50 border-border focus:border-brand-orange focus:ring-brand-orange text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-brand-orange hover:text-brand-yellow transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                tabIndex={0}
                className="bg-background/50 border-border focus:border-brand-orange focus:ring-brand-orange text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-orange to-brand-yellow hover:opacity-90 text-brand-dark transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
