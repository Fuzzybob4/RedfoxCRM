"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type React from "react"
import { handleSignUp } from "@/lib/auth"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [subscriptionType, setSubscriptionType] = useState("starter")
  const [billingPeriod, setBillingPeriod] = useState("monthly")
  const [cost, setCost] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Update cost based on subscription type and billing period
    if (subscriptionType === "starter") {
      setCost(billingPeriod === "monthly" ? 19 : 182.4)
    } else if (subscriptionType === "professional") {
      setCost(billingPeriod === "monthly" ? 85 : 816)
    }
  }, [subscriptionType, billingPeriod])

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await handleSignUp({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        companyName,
        subscriptionType,
        billingPeriod,
        cost,
      })

      if (!result.success) {
        // Handle specific error cases
        if (result.error?.message) {
          throw new Error(result.error.message)
        } else {
          throw new Error("Failed to create account. Please try again.")
        }
      }

      // Success! Show success message and redirect
      toast({
        title: "Account Created Successfully! 🎉",
        description: "Please check your email to verify your account before logging in.",
      })

      // Clear the form
      setEmail("")
      setPassword("")
      setFirstName("")
      setLastName("")
      setPhoneNumber("")
      setCompanyName("")

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login?message=Please check your email to verify your account")
      }, 2000)
    } catch (error) {
      console.error("Signup error:", error)

      // Handle specific Supabase errors
      let errorMessage = "An unexpected error occurred"

      if (error instanceof Error) {
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Please try logging in instead."
        } else if (error.message.includes("Password")) {
          errorMessage = "Password must be at least 6 characters long."
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address."
        } else if (error.message.includes("weak password")) {
          errorMessage = "Password is too weak. Please use a stronger password."
        } else {
          errorMessage = error.message
        }
      }

      setError(errorMessage)
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Sign Up</CardTitle>
        <CardDescription className="text-gray-400">Fill in your details to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-white">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white">
              Company Name
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscriptionType" className="text-white">
              Subscription Type
            </Label>
            <Select value={subscriptionType} onValueChange={setSubscriptionType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingPeriod" className="text-white">
              Billing Period
            </Label>
            <Select value={billingPeriod} onValueChange={setBillingPeriod}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select billing period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost" className="text-white">
              Cost
            </Label>
            <Input id="cost" type="number" value={cost} readOnly className="bg-white/10 border-white/20 text-white" />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white"
          disabled={isLoading}
          onClick={handleSignUpSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </CardFooter>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </Card>
  )
}
