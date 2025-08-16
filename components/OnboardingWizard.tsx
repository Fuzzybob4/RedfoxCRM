"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { completeOnboarding } from "@/lib/onboarding"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Building2, Users, Target, CheckCircle } from "lucide-react"

const steps = [
  { id: 1, title: "Business Information", icon: Building2 },
  { id: 2, title: "Team Setup", icon: Users },
  { id: 3, title: "Goals & Preferences", icon: Target },
  { id: 4, title: "Complete Setup", icon: CheckCircle },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    companySize: "",
    businessType: "",
    primaryGoals: [] as string[],
    description: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      await completeOnboarding(formData)
      toast({
        title: "Welcome to RedFox CRM!",
        description: "Your account has been set up successfully.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter((g) => g !== goal)
        : [...prev.primaryGoals, goal],
    }))
  }

  const goals = [
    "Increase Sales",
    "Improve Customer Service",
    "Streamline Operations",
    "Better Team Management",
    "Enhanced Reporting",
    "Mobile Access",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to RedFox CRM</CardTitle>
          <CardDescription>Let's set up your account in just a few steps</CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-1 ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tell us about your business</h3>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscaping">Landscaping & Lawn Care</SelectItem>
                    <SelectItem value="holiday-lighting">Holiday Lighting</SelectItem>
                    <SelectItem value="property-management">Property Management</SelectItem>
                    <SelectItem value="home-services">Home Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, companySize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 employees</SelectItem>
                    <SelectItem value="6-20">6-20 employees</SelectItem>
                    <SelectItem value="21-50">21-50 employees</SelectItem>
                    <SelectItem value="51+">51+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Team Setup</h3>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Team Features Available:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• User role management</li>
                  <li>• Team scheduling and assignments</li>
                  <li>• Performance tracking</li>
                  <li>• Communication tools</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What are your primary goals?</h3>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <Badge
                    key={goal}
                    variant={formData.primaryGoals.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer p-3 justify-center hover:bg-blue-100"
                    onClick={() => toggleGoal(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Additional Information (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us more about your business needs..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Ready to Get Started!</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-medium mb-2">Setup Summary:</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    <strong>Business:</strong> {formData.businessName}
                  </li>
                  <li>
                    <strong>Industry:</strong> {formData.industry}
                  </li>
                  <li>
                    <strong>Size:</strong> {formData.companySize}
                  </li>
                  <li>
                    <strong>Goals:</strong> {formData.primaryGoals.join(", ")}
                  </li>
                </ul>
              </div>
              <p className="text-gray-600">
                Your RedFox CRM account will be configured based on your preferences. You can always modify these
                settings later.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.businessName || !formData.industry)) ||
                  (currentStep === 2 && !formData.businessType)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
              >
                {isLoading ? "Setting up..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
