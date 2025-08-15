"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Building, Users, Target, CheckCircle } from "lucide-react"
import { useAuth } from "../app/components/auth-provider"
import { completeOnboarding } from "../lib/onboarding"
import { useRouter } from "next/navigation"

interface OnboardingData {
  businessName: string
  businessType: string
  companySize: string
  industry: string
  goals: string[]
  contactInfo: {
    phone: string
    address: string
    website: string
  }
}

const steps = [
  {
    id: 1,
    title: "Business Information",
    description: "Tell us about your business",
    icon: Building,
  },
  {
    id: 2,
    title: "Company Details",
    description: "Help us understand your needs",
    icon: Users,
  },
  {
    id: 3,
    title: "Goals & Objectives",
    description: "What do you want to achieve?",
    icon: Target,
  },
  {
    id: 4,
    title: "Contact Information",
    description: "How can we reach you?",
    icon: CheckCircle,
  },
]

const businessTypes = ["Sole Proprietorship", "Partnership", "LLC", "Corporation", "Non-profit", "Other"]

const companySizes = ["1-5 employees", "6-20 employees", "21-50 employees", "51-200 employees", "200+ employees"]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Retail",
  "Manufacturing",
  "Education",
  "Professional Services",
  "Other",
]

const goalOptions = [
  "Improve customer relationships",
  "Increase sales",
  "Better organization",
  "Automate workflows",
  "Track performance",
  "Team collaboration",
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const [data, setData] = useState<OnboardingData>({
    businessName: "",
    businessType: "",
    companySize: "",
    industry: "",
    goals: [],
    contactInfo: {
      phone: "",
      address: "",
      website: "",
    },
  })

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

  const handleGoalToggle = (goal: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const handleComplete = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await completeOnboarding(user.id, data)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={data.businessName}
                onChange={(e) => setData((prev) => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter your business name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select
                value={data.businessType}
                onValueChange={(value) => setData((prev) => ({ ...prev, businessType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={data.industry}
                onValueChange={(value) => setData((prev) => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size *</Label>
              <Select
                value={data.companySize}
                onValueChange={(value) => setData((prev) => ({ ...prev, companySize: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>What best describes your current situation?</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Just getting started</h4>
                  <p className="text-sm text-gray-600">New business looking to organize customer data</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Growing business</h4>
                  <p className="text-sm text-gray-600">Need better tools to manage increasing customers</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Established business</h4>
                  <p className="text-sm text-gray-600">Looking to improve existing processes</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>What are your main goals? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <div
                    key={goal}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      data.goals.includes(goal) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleGoalToggle(goal)}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded border-2 ${
                          data.goals.includes(goal) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                      >
                        {data.goals.includes(goal) && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={data.contactInfo.phone}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value },
                  }))
                }
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={data.contactInfo.address}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, address: e.target.value },
                  }))
                }
                placeholder="Enter your business address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={data.contactInfo.website}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, website: e.target.value },
                  }))
                }
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.businessName && data.businessType && data.industry
      case 2:
        return data.companySize
      case 3:
        return data.goals.length > 0
      case 4:
        return true // Contact info is optional
      default:
        return false
    }
  }

  const currentStepData = steps[currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to RedFox CRM</CardTitle>
          <CardDescription>Let's set up your account to get the most out of our platform</CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {currentStepData.icon && <currentStepData.icon className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              <p className="text-sm text-gray-600">{currentStepData.description}</p>
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? "Setting up..." : "Complete Setup"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
