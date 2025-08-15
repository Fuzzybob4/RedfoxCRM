"use client"

import { useState } from "react"
import { createBusiness, composeAddress } from "@/lib/onboarding"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { X, Building, Users, CreditCard, Check } from "lucide-react"

type OrgForm = {
  name: string
  plan: "free" | "pro" | "business" | "enterprise"
  line1?: string
  line2?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  email?: string
  website?: string
}

type InviteRow = {
  name?: string
  email: string
  role: "admin" | "manager" | "employee" | "viewer"
}

interface OnboardingWizardProps {
  open: boolean
  onClose: () => void
}

const PLAN_OPTIONS = [
  { value: "free", label: "Free", description: "Perfect for getting started" },
  { value: "pro", label: "Pro", description: "For growing businesses" },
  { value: "business", label: "Business", description: "For established companies" },
  { value: "enterprise", label: "Enterprise", description: "For large organizations" },
]

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [org, setOrg] = useState<OrgForm>({ name: "", plan: "pro" })
  const [invites, setInvites] = useState<InviteRow[]>([{ email: "", role: "employee" }])
  const [orgId, setOrgId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { toast } = useToast()

  const saveBusiness = async () => {
    if (!org.name.trim()) {
      toast({
        title: "Business name required",
        description: "Please enter your business name to continue.",
        variant: "destructive",
      })
      return
    }

    setBusy(true)
    try {
      console.log("Starting business creation process...")

      // Compose address from parts
      const address = composeAddress({
        line1: org.line1,
        line2: org.line2,
        city: org.city,
        state: org.state,
        zip: org.zip,
      })

      console.log("Creating business with data:", {
        name: org.name.trim(),
        plan: org.plan,
        address,
        phone: org.phone || null,
        email: org.email || null,
        website: org.website || null,
      })

      const newOrgId = await createBusiness({
        name: org.name.trim(),
        plan: org.plan,
        address,
        phone: org.phone || null,
        email: org.email || null,
        website: org.website || null,
      })

      console.log("Business created successfully:", newOrgId)

      setOrgId(newOrgId)
      toast({
        title: "Business created!",
        description: "Your business profile has been set up successfully.",
      })
      setStep(2)
    } catch (error) {
      console.error("Error in saveBusiness:", error)
      toast({
        title: "Error creating business",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setBusy(false)
    }
  }

  const sendInvites = async () => {
    if (!orgId) {
      setStep(3)
      return
    }

    setBusy(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No authenticated user")

      const validInvites = invites
        .filter((invite) => invite.email.trim())
        .map((invite) => ({
          org_id: orgId,
          email: invite.email.trim().toLowerCase(),
          role: invite.role,
          invited_name: invite.name?.trim() || null,
          invited_by: user.id,
        }))

      if (validInvites.length > 0) {
        const { error } = await supabase.from("invites").insert(validInvites)
        if (error) throw error

        toast({
          title: "Invites sent!",
          description: `${validInvites.length} team member${validInvites.length === 1 ? "" : "s"} invited.`,
        })
      }

      setStep(3)
    } catch (error) {
      console.error("Error sending invites:", error)
      toast({
        title: "Error sending invites",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setBusy(false)
    }
  }

  const finish = () => {
    toast({
      title: "Welcome to RedFox CRM! 🎉",
      description: "Your account is now set up and ready to use.",
    })
    onClose()
  }

  const addInviteRow = () => {
    setInvites([...invites, { email: "", role: "employee" }])
  }

  const updateInvite = (index: number, field: keyof InviteRow, value: string) => {
    const updated = [...invites]
    updated[index] = { ...updated[index], [field]: value }
    setInvites(updated)
  }

  const removeInvite = (index: number) => {
    if (invites.length > 1) {
      setInvites(invites.filter((_, i) => i !== index))
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum === step
                      ? "bg-[#F67721] text-white"
                      : stepNum < step
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
                </div>
              ))}
            </div>
            <CardTitle className="ml-4">
              {step === 1 && "Business Information"}
              {step === 2 && "Invite Your Team"}
              {step === 3 && "Branding & Payments"}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#F67721] mb-4">
                <Building className="w-5 h-5" />
                <span className="font-medium">Tell us about your business</span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={org.name}
                    onChange={(e) => setOrg({ ...org, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="line1">Address Line 1</Label>
                    <Input
                      id="line1"
                      placeholder="Street address"
                      value={org.line1 || ""}
                      onChange={(e) => setOrg({ ...org, line1: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      placeholder="Apt, suite, etc."
                      value={org.line2 || ""}
                      onChange={(e) => setOrg({ ...org, line2: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={org.city || ""}
                      onChange={(e) => setOrg({ ...org, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={org.state || ""}
                      onChange={(e) => setOrg({ ...org, state: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="ZIP"
                      value={org.zip || ""}
                      onChange={(e) => setOrg({ ...org, zip: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Business phone"
                      value={org.phone || ""}
                      onChange={(e) => setOrg({ ...org, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Business email"
                      value={org.email || ""}
                      onChange={(e) => setOrg({ ...org, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={org.website || ""}
                    onChange={(e) => setOrg({ ...org, website: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Plan Selection</Label>
                  <Select value={org.plan} onValueChange={(value: any) => setOrg({ ...org, plan: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_OPTIONS.map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                          <div>
                            <div className="font-medium">{plan.label}</div>
                            <div className="text-sm text-gray-500">{plan.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={saveBusiness}
                  disabled={busy || !org.name.trim()}
                  className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]"
                >
                  {busy ? "Creating..." : "Continue"}
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#F67721] mb-4">
                <Users className="w-5 h-5" />
                <span className="font-medium">Invite your team members</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Add team members to collaborate on your projects. You can always invite more people later.
              </p>

              <div className="space-y-3">
                {invites.map((invite, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      placeholder="Name (optional)"
                      value={invite.name || ""}
                      onChange={(e) => updateInvite(index, "name", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={invite.email}
                      onChange={(e) => updateInvite(index, "email", e.target.value)}
                      className="flex-1"
                    />
                    <Select value={invite.role} onValueChange={(value: any) => updateInvite(index, "role", value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    {invites.length > 1 && (
                      <Button variant="outline" size="icon" onClick={() => removeInvite(index)} className="shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={addInviteRow} className="w-full bg-transparent">
                + Add another team member
              </Button>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={sendInvites}
                  disabled={busy}
                  className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]"
                >
                  {busy ? "Sending..." : "Continue"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#F67721] mb-4">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Branding & Payments</span>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">You're all set!</h3>
                <p className="text-gray-600 mb-6">
                  Your RedFox CRM account is ready to use. You can upload your logo and connect billing later in
                  Settings.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={finish} className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
