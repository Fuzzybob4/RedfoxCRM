"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBusiness, type BusinessInfo } from "@/lib/onboarding"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    industry: "",
    size: "",
    plan: "starter",
  })
  const { toast } = useToast()

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Submitting business info:", businessInfo)
      const result = await createBusiness(businessInfo)
      console.log("Business creation result:", result)

      toast({
        title: "Success!",
        description: "Your organization has been created successfully.",
      })

      // Move to next step
      setStep(2)
    } catch (error) {
      console.error("Error creating business:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    toast({
      title: "Welcome!",
      description: "Your account setup is complete. Welcome to RedFox CRM!",
    })
    onComplete()
  }

  // Debug function for testing direct insert
  const testDirectInsert = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from("organizations")
        .insert([{ name: "RLS Test", plan: "pro", owner_id: user!.id }]) // only required cols
        .select("id")
        .single()
      console.log("direct insert ->", { data, error })
      toast({
        title: "Direct Insert Test",
        description: `Result: ${data ? "Success" : "Failed"} - Check console for details`,
        variant: data ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Direct insert test error:", error)
      toast({
        title: "Direct Insert Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to RedFox CRM</CardTitle>
            <CardDescription>Let's set up your business information to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  type="text"
                  placeholder="Enter your business name"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={businessInfo.industry}
                  onValueChange={(value) => setBusinessInfo({ ...businessInfo, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select
                  value={businessInfo.size}
                  onValueChange={(value) => setBusinessInfo({ ...businessInfo, size: value })}
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

              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select
                  value={businessInfo.plan}
                  onValueChange={(value) => setBusinessInfo({ ...businessInfo, plan: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter - Free</SelectItem>
                    <SelectItem value="pro">Pro - $29/month</SelectItem>
                    <SelectItem value="enterprise">Enterprise - $99/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Continue"}
              </Button>
            </form>

            {/* Debug section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Debug Tools:</p>
              <Button variant="outline" size="sm" onClick={testDirectInsert} className="w-full bg-transparent">
                Test Direct Insert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Setup Complete!</CardTitle>
            <CardDescription>Your organization has been created successfully.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Welcome to RedFox CRM!</h3>
                <p className="text-gray-600 mb-4">
                  Your account is now set up and ready to use. You can start managing your customers, projects, and
                  more.
                </p>
              </div>

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
