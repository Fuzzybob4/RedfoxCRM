"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type React from "react"
import { useScrollToTop } from "../hooks/useScrollToTop"
import { handleSignUp } from "@/lib/auth"

export default function SignUpForm() {
  useScrollToTop()
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
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const planFromUrl = searchParams.get("plan")
    if (planFromUrl === "starter" || planFromUrl === "professional") {
      setSubscriptionType(planFromUrl)
    }

    const lastAttempt = localStorage.getItem("lastSignUpAttempt")
    const now = Date.now()
    if (lastAttempt && now - Number.parseInt(lastAttempt) < 60000) {
      setIsRateLimited(true)
      setCountdown(60 - Math.floor((now - Number.parseInt(lastAttempt)) / 1000))
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRateLimited(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [searchParams])

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
    if (isRateLimited) {
      toast({
        title: "Rate Limited",
        description: `Please wait ${countdown} seconds before trying again.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      localStorage.setItem("lastSignUpAttempt", Date.now().toString())

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
        throw result.error
      }

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Error in handleSignUp:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "There was an error during sign up. Please try again.",
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
          disabled={isRateLimited || isLoading}
          onClick={handleSignUpSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing Up...
            </>
          ) : isRateLimited ? (
            `Try again in ${countdown}s`
          ) : (
            "Sign Up"
          )}
        </Button>
      </CardFooter>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </Card>
  )
}

