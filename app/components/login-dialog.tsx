"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "./auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface LoginDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const handleOpen = (openState: boolean) => {
    if (onOpenChange) {
      onOpenChange(openState)
    } else {
      setIsOpen(openState)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      handleOpen(false)
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signUp(email, password, name)
      handleOpen(false)
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      })
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const dialogOpen = open !== undefined ? open : isOpen

  if (onOpenChange) {
    return (
      <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Welcome to RedFox CRM</DialogTitle>
            <DialogDescription className="text-gray-600">
              Sign in to your account or create a new one to get started.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus:ring-[#F67721] focus:border-[#F67721]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:ring-[#F67721] focus:border-[#F67721]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="focus:ring-[#F67721] focus:border-[#F67721]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus:ring-[#F67721] focus:border-[#F67721]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:ring-[#F67721] focus:border-[#F67721]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white hover:text-[#F5F906] hover:bg-white/10">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Welcome to RedFox CRM</DialogTitle>
          <DialogDescription className="text-gray-600">
            Sign in to your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-[#F67721] focus:border-[#F67721]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-[#F67721] focus:border-[#F67721]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus:ring-[#F67721] focus:border-[#F67721]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-[#F67721] focus:border-[#F67721]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-[#F67721] focus:border-[#F67721]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
