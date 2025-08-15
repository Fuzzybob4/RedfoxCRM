"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBusinessStep1, updateBusinessStep2 } from "@/lib/onboarding"
import { CheckCircle, Building2, Phone, Mail, Globe, MapPin } from "lucide-react"

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)

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
    if (!businessName.trim() || !companySize) return

    setIsLoading(true)
    setError(null)

    try {
      const organizationId = await createBusinessStep1(businessName, companySize)
      setOrgId(organizationId)
      setCurrentStep(2)
    } catch (err) {
      console.error("Step 1 error:", err)
      setError(err instanceof Error ? err.message : "Failed to create business")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgId) return

    setIsLoading(true)
    setError(null)

    try {
      await updateBusinessStep2(orgId, businessEmail, phoneNumber, website, address)
      setCurrentStep(3)
    } catch (err) {
      console.error("Step 2 error:", err)
      setError(err instanceof Error ? err.message : "Failed to update business information")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  if (currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to RedFox CRM</CardTitle>
            <CardDescription>Let's set up your business account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select value={companySize} onValueChange={setCompanySize} required>
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

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading || !businessName.trim() || !companySize}>
                {isLoading ? "Creating..." : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Contact Information</CardTitle>
            <CardDescription>Add your business contact details (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessEmail">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Business Email
                </Label>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="business@example.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">
                  <Globe className="inline h-4 w-4 mr-2" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Business Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St, City, State 12345"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => handleStep2Submit(new Event("submit") as any)}>
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

  if (currentStep === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription>Your business account has been created successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">{businessName}</h3>
                <p className="text-sm text-green-600">Pro Plan • {companySize}</p>
              </div>

              <p className="text-sm text-gray-600">
                You're all set! You can now start managing your customers, projects, and invoices.
              </p>

              <Button onClick={handleComplete} className="w-full">
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
