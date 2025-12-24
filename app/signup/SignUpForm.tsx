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
import { createClient } from "@/lib/supabase/client"

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
    if (subscriptionType === "starter") {
      setCost(billingPeriod === "monthly" ? 29 : 278.4) // $29/mo or $23.20/mo * 12 (20% off)
    } else if (subscriptionType === "professional") {
      setCost(billingPeriod === "monthly" ? 79 : 758.4) // $79/mo or $63.20/mo * 12 (20% off)
    } else if (subscriptionType === "enterprise") {
      setCost(billingPeriod === "monthly" ? 199 : 1910.4) // $199/mo or $159.20/mo * 12 (20% off)
    }
  }, [subscriptionType, billingPeriod])

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            company_name: companyName,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (authData.user && authData.session) {
        // Create organization
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({ name: companyName || `${firstName}'s Organization` })
          .select("id")
          .single()

        if (orgError) {
          console.error("Error creating organization:", orgError)
        } else if (org) {
          // Create membership with owner role
          await supabase.from("user_memberships").insert({
            user_id: authData.user.id,
            org_id: org.id,
            role: "owner",
          })

          // Create business profile
          await supabase.from("business_profiles").insert({
            org_id: org.id,
            business_name: companyName || `${firstName}'s Business`,
            email: email,
            phone: phoneNumber || null,
          })

          const trialEnd = new Date()
          trialEnd.setDate(trialEnd.getDate() + 30) // 30-day trial

          await supabase.from("subscriptions").insert({
            org_id: org.id,
            user_id: authData.user.id,
            plan_type: subscriptionType,
            billing_period: billingPeriod,
            status: "trial",
            amount: cost,
            trial_start: new Date().toISOString(),
            trial_end: trialEnd.toISOString(),
            current_period_start: new Date().toISOString(),
            current_period_end: trialEnd.toISOString(),
          })

          // Create/update profile
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            email: email,
            full_name: `${firstName} ${lastName}`,
            role: "owner",
          })
        }

        toast({
          title: "Account Created Successfully!",
          description: "Redirecting to your dashboard...",
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        // Email confirmation required
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to verify your account before logging in.",
        })

        setEmail("")
        setPassword("")
        setFirstName("")
        setLastName("")
        setPhoneNumber("")
        setCompanyName("")

        setTimeout(() => {
          router.push("/login?message=Please check your email to verify your account")
        }, 2000)
      }
    } catch (error) {
      console.error("Signup error:", error)

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
              minLength={6}
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
              required
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
                <SelectItem value="starter">Starter - $29/month</SelectItem>
                <SelectItem value="professional">Professional - $79/month</SelectItem>
                <SelectItem value="enterprise">Enterprise - $199/month</SelectItem>
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
                <SelectItem value="yearly">Yearly (20% off)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400">Estimated Cost</p>
            <p className="text-2xl font-bold text-white">
              ${cost.toFixed(2)}
              <span className="text-sm text-gray-400">/{billingPeriod === "monthly" ? "mo" : "yr"}</span>
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white"
          disabled={isLoading}
          onClick={handleSignUpSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-[#F67721] hover:underline">
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
