"use client"

import { useState } from "react"
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
  address?: string
  phone?: string
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

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error("User error:", userError)
        throw new Error("Authentication error: " + userError.message)
      }

      if (!user) {
        throw new Error("No authenticated user found")
      }

      console.log("User authenticated:", user.id)

      // 1) Create organization
      console.log("Creating organization with data:", {
        name: org.name.trim(),
        plan: org.plan,
        address: org.address?.trim() || null,
        phone: org.phone?.trim() || null,
        owner_id: user.id,
      })

      const { data: newOrg, error: orgErr } = await supabase
        .from("organizations")
        .insert({
          name: org.name.trim(),
          plan: org.plan,
          address: org.address?.trim() || null,
          phone: org.phone?.trim() || null,
          owner_id: user.id,
        })
        .select("id")
        .single()

      if (orgErr) {
        console.error("Organization creation error:", orgErr)
        throw new Error("Failed to create organization: " + orgErr.message)
      }

      if (!newOrg?.id) {
        throw new Error("Organization created but no ID returned")
      }

      console.log("Organization created successfully:", newOrg.id)

      // 2) Create owner membership
      console.log("Creating owner membership...")
      const { error: memErr } = await supabase.from("memberships").insert({
        org_id: newOrg.id,
        user_id: user.id,
        role: "owner",
      })

      if (memErr) {
        console.error("Membership creation error:", memErr)
        throw new Error("Failed to create membership: " + memErr.message)
      }

      console.log("Membership created successfully")

      // 3) Set as default organization
      console.log("Setting default organization...")
      const { error: profileErr } = await supabase.from("profiles").update({ default_org: newOrg.id }).eq("id", user.id)

      if (profileErr) {
        console.error("Profile update error:", profileErr)
        // Don't fail the whole process for this
        console.warn("Failed to set default org, but continuing...")
      } else {
        console.log("Default organization set successfully")
      }

      setOrgId(newOrg.id)
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

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Business address (optional)"
                    value={org.address || ""}
                    onChange={(e) => setOrg({ ...org, address: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Business phone (optional)"
                    value={org.phone || ""}
                    onChange={(e) => setOrg({ ...org, phone: e.target.value })}
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
