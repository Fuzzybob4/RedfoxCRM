"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Mock authentication for testing
const mockUsers = [
  { id: "demo-user-123", email: "demo@example.com", password: "demo123" },
  { id: "john-doe-456", email: "john@example.com", password: "john123" },
  { id: "jane-smith-789", email: "jane@example.com", password: "jane123" },
  { id: "test-user-001", email: "test@example.com", password: "test123" },
]

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock authentication
      const user = mockUsers.find((u) => u.email === email && u.password === password)

      if (!user) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Store mock session
      localStorage.setItem("mock_user", JSON.stringify(user))
      localStorage.setItem("mock_session", "true")

      toast({
        title: "Success",
        description: "Signed in successfully!",
      })

      // Redirect to user-specific dashboard
      window.location.href = `/dashboard/${user.id}`
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-[#08042B]">Sign In</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Enter your credentials to access your dashboard
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#08042B]">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
              tabIndex={0}
              className="bg-white/50 border-gray-300 focus:border-[#F67721] focus:ring-[#F67721] text-[#08042B] placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#08042B]">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              required
              tabIndex={0}
              className="bg-white/50 border-gray-300 focus:border-[#F67721] focus:ring-[#F67721] text-[#08042B] placeholder:text-gray-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
