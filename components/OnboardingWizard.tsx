"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBusiness, composeAddress, sendTeamInvites } from "@/lib/onboarding"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Building, Users, CheckCircle } from "lucide-react"

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

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [org, setOrg] = useState<OrgForm>({
    name: "",
    plan: "pro",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    website: "",
  })
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
      const address = composeAddress({
        line1: org.line1,
        line2: org.line2,
        city: org.city,
        state: org.state,
        zip: org.zip,
      })

      console.log("Creating business with data:", {
        name: org.name,
        plan: org.plan,
        address,
        phone: org.phone || null,
        email: org.email || null,
        website: org.website || null,
      })

      const newOrgId = await createBusiness({
        name: org.name,
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
    } catch (error: any) {
      console.error("Error creating business:", error)
      toast({
        title: "Error creating business",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setBusy(false)
    }
  }

  const sendInvitations = async () => {
    if (!orgId) {
      setStep(3)
      return
    }

    const validInvites = invites.filter((invite) => invite.email.trim())

    if (validInvites.length === 0) {
      setStep(3)
      return
    }

    setBusy(true)

    try {
      const sentCount = await sendTeamInvites(orgId, validInvites)
      toast({
        title: "Invitations sent!",
        description: `${sentCount} team member${sentCount === 1 ? "" : "s"} invited successfully.`,
      })
      setStep(3)
    } catch (error: any) {
      console.error("Error sending invites:", error)
      toast({
        title: "Error sending invitations",
        description: error.message || "Failed to send some invitations",
        variant: "destructive",
      })
      // Still proceed to step 3 even if invites fail
      setStep(3)
    } finally {
      setBusy(false)
    }
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

  const finish = () => {
    toast({
      title: "Welcome to RedFox CRM!",
      description: "Your account is now set up and ready to use.",
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && (
              <>
                <Building className="w-5 h-5" /> Business Information
              </>
            )}
            {step === 2 && (
              <>
                <Users className="w-5 h-5" /> Invite Your Team
              </>
            )}
            {step === 3 && (
              <>
                <CheckCircle className="w-5 h-5" /> All Set!
              </>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded ${s <= step ? "bg-orange-500" : "bg-gray-200"}`} />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={org.name}
                    onChange={(e) => setOrg({ ...org, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="plan">Plan Selection</Label>
                  <Select value={org.plan} onValueChange={(value: any) => setOrg({ ...org, plan: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free - Basic features</SelectItem>
                      <SelectItem value="pro">Pro - Advanced features</SelectItem>
                      <SelectItem value="business">Business - Full features</SelectItem>
                      <SelectItem value="enterprise">Enterprise - Custom solution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="line1">Address Line 1</Label>
                    <Input
                      id="line1"
                      placeholder="Street address"
                      value={org.line1}
                      onChange={(e) => setOrg({ ...org, line1: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      placeholder="Apt, suite, etc."
                      value={org.line2}
                      onChange={(e) => setOrg({ ...org, line2: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={org.city}
                      onChange={(e) => setOrg({ ...org, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={org.state}
                      onChange={(e) => setOrg({ ...org, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="ZIP"
                      value={org.zip}
                      onChange={(e) => setOrg({ ...org, zip: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Business phone"
                      value={org.phone}
                      onChange={(e) => setOrg({ ...org, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Business email"
                      value={org.email}
                      onChange={(e) => setOrg({ ...org, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={org.website}
                    onChange={(e) => setOrg({ ...org, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={saveBusiness}
                  disabled={busy || !org.name.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Invite team members to collaborate on your projects. You can always add more later.
                </p>

                {invites.map((invite, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`name-${index}`}>Name (optional)</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="Full name"
                        value={invite.name || ""}
                        onChange={(e) => updateInvite(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`email-${index}`}>Email *</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        placeholder="email@example.com"
                        value={invite.email}
                        onChange={(e) => updateInvite(index, "email", e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`role-${index}`}>Role</Label>
                      <Select value={invite.role} onValueChange={(value: any) => updateInvite(index, "role", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {invites.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeInvite(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Button variant="outline" onClick={addInviteRow}>
                  + Add Another Person
                </Button>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={sendInvitations} disabled={busy} className="bg-orange-500 hover:bg-orange-600">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">Welcome to RedFox CRM!</h3>
                <p className="text-gray-600">
                  Your business profile has been created successfully. You can now start managing your customers,
                  projects, and team.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-left">
                  <h4 className="font-medium mb-2">What's next?</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Add your first customers</li>
                    <li>• Create projects and estimates</li>
                    <li>• Customize your business settings</li>
                    <li>• Upload your logo and branding</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={finish} className="bg-orange-500 hover:bg-orange-600">
                  Get Started
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
