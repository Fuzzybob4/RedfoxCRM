"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBusinessStep1, updateBusinessStep2 } from "@/lib/onboarding"
import { useToast } from "@/hooks/use-toast"

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const { toast } = useToast()

  // Step 1 form data
  const [businessName, setBusinessName] = useState("")
  const [companySize, setCompanySize] = useState("")

  // Step 2 form data
  const [businessEmail, setBusinessEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [website, setWebsite] = useState("")
  const [address, setAddress] = useState("")

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessName.trim()) {
      toast({
        title: "Error",
        description: "Business name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Submitting step 1:", { businessName, companySize })

      const createdOrgId = await createBusinessStep1(businessName, companySize)
      setOrgId(createdOrgId)

      toast({
        title: "Success",
        description: "Business created successfully!",
      })

      setStep(2)
    } catch (error) {
      console.error("Step 1 error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create business",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orgId) {
      toast({
        title: "Error",
        description: "Organization ID missing. Please restart the process.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Submitting step 2:", { orgId, businessEmail, phoneNumber, website, address })

      await updateBusinessStep2(orgId, businessEmail, phoneNumber, website, address)

      toast({
        title: "Success",
        description: "Business setup completed successfully!",
      })

      // Complete onboarding
      onComplete()
    } catch (error) {
      console.error("Step 2 error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update business information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipStep2 = () => {
    toast({
      title: "Setup Complete",
      description: "You can add contact information later in your settings.",
    })
    onComplete()
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome to RedFox CRM</CardTitle>
            <CardDescription>Let's set up your business account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Contact Information</CardTitle>
          <CardDescription>Add your business contact details (optional)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <Label htmlFor="businessEmail">Business Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="business@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State 12345"
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleSkipStep2} className="flex-1 bg-transparent">
                Skip
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
