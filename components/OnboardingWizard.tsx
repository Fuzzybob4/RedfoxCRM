"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBusiness, type BusinessInfo } from "@/lib/onboarding"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    companySize: "",
  })
  const { toast } = useToast()

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessInfo.businessName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your business name",
        variant: "destructive",
      })
      return
    }

    if (!businessInfo.companySize) {
      toast({
        title: "Error",
        description: "Please select your company size",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await createBusiness(businessInfo)

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })
        setCurrentStep(2)
      }
    } catch (error) {
      console.error("Business creation failed:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create business",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestDirectInsert = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log("logged-in user id =", user?.id)

      if (!user) {
        alert("Please sign in first")
        return
      }

      const { data, error } = await supabase
        .from("organizations")
        .insert([{ name: "RLS Test", plan: "pro", owner_id: user.id }])
        .select("id")
        .single()

      console.log("direct insert ->", { data, error })

      toast({
        title: error ? "Insert Failed" : "Insert Success",
        description: error ? error.message : `Created org with ID: ${data?.id}`,
        variant: error ? "destructive" : "default",
      })
    } catch (error) {
      console.error("Direct insert test failed:", error)
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  if (currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to RedFox CRM</CardTitle>
            <CardDescription>Let's set up your business profile to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={businessInfo.businessName}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  value={businessInfo.companySize}
                  onValueChange={(value) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      companySize: value,
                    }))
                  }
                >
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Continue"}
              </Button>
            </form>

            {/* Debug section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Debug Tools:</p>
              <Button variant="outline" size="sm" onClick={handleTestDirectInsert} className="w-full bg-transparent">
                Test Direct Insert
              </Button>
            </div>
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
            <CardTitle className="text-2xl font-bold text-green-600">🎉 Welcome to RedFox CRM!</CardTitle>
            <CardDescription>Your business profile has been created successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Business Summary</h3>
              <p>
                <strong>Name:</strong> {businessInfo.businessName}
              </p>
              <p>
                <strong>Size:</strong> {businessInfo.companySize}
              </p>
              <p>
                <strong>Plan:</strong> Pro
              </p>
            </div>

            <Button onClick={onComplete} className="w-full">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
