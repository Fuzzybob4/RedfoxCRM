"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBusiness, composeAddress } from "@/lib/onboarding"
import { supabase } from "@/lib/supabase"

type OrgForm = {
  name: string
  plan: "free" | "pro" | "business" | "enterprise"
  address?: string
  phone?: string
  email?: string
  website?: string
}

type InviteRow = {
  name?: string
  email: string
  role: "admin" | "manager" | "employee" | "viewer"
}

export function OnboardingWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [org, setOrg] = useState<OrgForm>({ name: "", plan: "pro" })
  const [invites, setInvites] = useState<InviteRow[]>([{ email: "", role: "employee" }])
  const [orgId, setOrgId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Address fields
  const [line1, setLine1] = useState("")
  const [line2, setLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")

  const saveBusiness = async () => {
    if (!org.name.trim()) {
      setError("Business name is required")
      return
    }

    setBusy(true)
    setError(null)

    try {
      console.log("Starting business creation...")

      const address = composeAddress({ line1, line2, city, state, zip })

      console.log("Creating business with data:", {
        name: org.name,
        plan: org.plan,
        address,
        phone: phone || null,
        email: email || null,
        website: website || null,
      })

      const newOrgId = await createBusiness({
        name: org.name,
        plan: org.plan,
        address,
        phone: phone || null,
        email: email || null,
        website: website || null,
      })

      console.log("Business created successfully with ID:", newOrgId)

      setOrgId(newOrgId)
      setStep(2)
    } catch (err: any) {
      console.error("Error creating business:", err)
      setError(err.message ?? "Unexpected error creating business")
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
    setError(null)

    try {
      const validInvites = invites.filter((r) => r.email.trim())

      if (validInvites.length > 0) {
        console.log("Sending invites:", validInvites)

        const rows = validInvites.map((r) => ({
          org_id: orgId,
          email: r.email.trim(),
          role: r.role,
          invited_name: r.name?.trim() || null,
        }))

        const { error } = await supabase.from("invites").insert(rows)

        if (error) {
          console.error("Error sending invites:", error)
          setError(error.message ?? "Failed to send invites")
          return
        }

        console.log("Invites sent successfully")
      }

      setStep(3)
    } catch (err: any) {
      console.error("Error in sendInvites:", err)
      setError(err.message ?? "Unexpected error sending invites")
    } finally {
      setBusy(false)
    }
  }

  const finish = () => {
    console.log("Onboarding completed")
    onClose()
  }

  const addInvite = () => {
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Welcome to RedFox CRM</span>
            <span className="text-sm font-normal text-muted-foreground">Step {step} of 3</span>
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tell us about your business</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={org.name}
                    onChange={(e) => setOrg({ ...org, name: e.target.value })}
                    disabled={busy}
                  />
                </div>

                <div>
                  <Label htmlFor="plan">Plan Selection</Label>
                  <Select value={org.plan} onValueChange={(value: any) => setOrg({ ...org, plan: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free - Basic features</SelectItem>
                      <SelectItem value="pro">Pro - Advanced features</SelectItem>
                      <SelectItem value="business">Business - Team collaboration</SelectItem>
                      <SelectItem value="enterprise">Enterprise - Full suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="line1">Address Line 1</Label>
                    <Input
                      id="line1"
                      placeholder="Street address"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      placeholder="Apt, suite, etc."
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="ZIP"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Business Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@business.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://www.business.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveBusiness} disabled={busy || !org.name.trim()} className="min-w-[120px]">
                  {busy ? "Creating..." : "Continue"}
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Invite your team</h2>
              <p className="text-muted-foreground">
                Add team members to your organization. You can skip this step and add them later.
              </p>

              <div className="space-y-3">
                {invites.map((invite, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Name (optional)</Label>
                      <Input
                        placeholder="Full name"
                        value={invite.name || ""}
                        onChange={(e) => updateInvite(i, "name", e.target.value)}
                        disabled={busy}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={invite.email}
                        onChange={(e) => updateInvite(i, "email", e.target.value)}
                        disabled={busy}
                      />
                    </div>
                    <div className="w-32">
                      <Label>Role</Label>
                      <Select value={invite.role} onValueChange={(value: any) => updateInvite(i, "role", value)}>
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
                      <Button variant="outline" size="sm" onClick={() => removeInvite(i)} disabled={busy}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={addInvite} disabled={busy}>
                  + Add Another
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setStep(3)} disabled={busy}>
                    Skip
                  </Button>
                  <Button onClick={sendInvites} disabled={busy}>
                    {busy ? "Sending..." : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-semibold">Welcome to RedFox CRM!</h2>
              <p className="text-muted-foreground">
                Your business profile has been created successfully. You can now start managing your customers,
                projects, and team.
              </p>

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                <p className="font-medium">Next Steps:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Add your first customer</li>
                  <li>• Create a project or estimate</li>
                  <li>• Customize your business settings</li>
                  <li>• Upload your logo and branding</li>
                </ul>
              </div>

              <Button onClick={finish} className="w-full">
                Get Started
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
