"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Building, Shield, CreditCard, Save, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

interface Profile {
  id: string
  full_name?: string
  email?: string
}

interface BusinessProfile {
  business_name?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
}

interface Organization {
  id: string
  name: string
}

interface Subscription {
  plan_type: string
  billing_period: string
  status: string
  amount?: number
  trial_end?: string
  stripe_customer_id?: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")

  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") || "profile"

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Fetch profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Fetch organization
      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (membership?.org_id) {
        setOrgId(membership.org_id)

        const { data: orgData } = await supabase.from("organizations").select("*").eq("id", membership.org_id).single()

        if (orgData) {
          setOrganization(orgData)
        }

        // Fetch business profile
        const { data: businessData } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("org_id", membership.org_id)
          .maybeSingle()

        if (businessData) {
          setBusinessProfile(businessData)
        }

        // Fetch subscription
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("org_id", membership.org_id)
          .maybeSingle()

        if (subData) {
          setSubscription(subData)
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      const { error } = await supabase.from("profiles").update({ full_name: profile.full_name }).eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleSaveBusinessProfile = async () => {
    if (!businessProfile || !orgId) return

    try {
      console.log("[v0] Updating business profile with billing address:", businessProfile)

      const { error } = await supabase
        .from("business_profiles")
        .upsert({
          org_id: orgId,
          business_name: businessProfile.business_name,
          phone: businessProfile.phone,
          email: businessProfile.email,
          address: businessProfile.address,
          city: businessProfile.city,
          state: businessProfile.state,
          zip_code: businessProfile.zip_code,
          country: businessProfile.country || "United States",
          website: businessProfile.website,
        })
        .eq("org_id", orgId)

      if (error) {
        console.error("[v0] Error updating business profile:", error)
        throw error
      }

      console.log("[v0] Business profile updated successfully")

      const { data: updatedBusinessData } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("org_id", orgId)
        .single()

      if (updatedBusinessData) {
        setBusinessProfile(updatedBusinessData)
        console.log("[v0] Refreshed business profile data:", updatedBusinessData)
      }

      toast({
        title: "Success",
        description: "Business profile updated successfully",
      })
    } catch (error: any) {
      console.error("[v0] Business profile update error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update business profile",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Password updated successfully",
      })

      setNewPassword("")
      setConfirmPassword("")
      setCurrentPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    }
  }

  const handleUpdateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Verification email sent to new address",
      })
    } catch (error) {
      console.error("Error updating email:", error)
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and business settings</p>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={(value) => {
            router.push(`/settings?tab=${value}`)
          }}
          className="space-y-6"
        >
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#F67721] data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-[#F67721] data-[state=active]:text-white">
              <Building className="w-4 h-4 mr-2" />
              Business
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#F67721] data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-[#F67721] data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="full_name" className="text-gray-700 font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    value={profile?.full_name || ""}
                    onChange={(e) => setProfile((prev) => (prev ? { ...prev, full_name: e.target.value } : null))}
                    className="bg-white border-gray-300 text-gray-900 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-gray-100 border-gray-300 text-gray-600 mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Contact support to change your email address</p>
                </div>
                <Button onClick={handleSaveProfile} className="bg-[#F67721] hover:bg-[#e56610]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="business_name" className="text-gray-700 font-semibold">
                    Business Name
                  </Label>
                  <Input
                    id="business_name"
                    value={businessProfile?.business_name || ""}
                    onChange={(e) =>
                      setBusinessProfile((prev) => (prev ? { ...prev, business_name: e.target.value } : null))
                    }
                    className="bg-white border-gray-300 text-gray-900 mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business_email" className="text-gray-700 font-semibold">
                      Business Email
                    </Label>
                    <Input
                      id="business_email"
                      type="email"
                      value={businessProfile?.email || ""}
                      onChange={(e) => setBusinessProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                      className="bg-white border-gray-300 text-gray-900 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business_phone" className="text-gray-700 font-semibold">
                      Business Phone
                    </Label>
                    <Input
                      id="business_phone"
                      value={businessProfile?.phone || ""}
                      onChange={(e) => setBusinessProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                      className="bg-white border-gray-300 text-gray-900 mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-gray-700 font-semibold">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={businessProfile?.address || ""}
                    onChange={(e) => setBusinessProfile((prev) => (prev ? { ...prev, address: e.target.value } : null))}
                    className="bg-white border-gray-300 text-gray-900 mt-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-700 font-semibold">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={businessProfile?.city || ""}
                      onChange={(e) => setBusinessProfile((prev) => (prev ? { ...prev, city: e.target.value } : null))}
                      className="bg-white border-gray-300 text-gray-900 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-gray-700 font-semibold">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={businessProfile?.state || ""}
                      onChange={(e) => setBusinessProfile((prev) => (prev ? { ...prev, state: e.target.value } : null))}
                      className="bg-white border-gray-300 text-gray-900 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code" className="text-gray-700 font-semibold">
                      ZIP Code
                    </Label>
                    <Input
                      id="zip_code"
                      value={businessProfile?.zip_code || ""}
                      onChange={(e) =>
                        setBusinessProfile((prev) => (prev ? { ...prev, zip_code: e.target.value } : null))
                      }
                      className="bg-white border-gray-300 text-gray-900 mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country" className="text-gray-700 font-semibold">
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={businessProfile?.country || ""}
                      onChange={(e) =>
                        setBusinessProfile((prev) => (prev ? { ...prev, country: e.target.value } : null))
                      }
                      className="bg-white border-gray-300 text-gray-900 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-gray-700 font-semibold">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={businessProfile?.website || ""}
                      onChange={(e) =>
                        setBusinessProfile((prev) => (prev ? { ...prev, website: e.target.value } : null))
                      }
                      className="bg-white border-gray-300 text-gray-900 mt-1"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveBusinessProfile} className="bg-[#F67721] hover:bg-[#e56610]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Business Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="new_password" className="text-gray-700 font-semibold">
                    New Password
                  </Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 mt-1"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm_password" className="text-gray-700 font-semibold">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 mt-1"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button onClick={handleChangePassword} className="bg-[#F67721] hover:bg-[#e56610]">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Subscription & Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscription ? (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan
                          </h3>
                          <p className="text-sm text-gray-600">
                            ${subscription.amount?.toFixed(2)} / {subscription.billing_period}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            subscription.status === "active"
                              ? "bg-green-500"
                              : subscription.status === "trial"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                          } text-white`}
                        >
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                      {subscription.status === "trial" && subscription.trial_end && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <p className="text-sm text-blue-900">
                            <strong>Trial Period:</strong> Your trial ends on{" "}
                            {new Date(subscription.trial_end).toLocaleDateString()}. Add payment method before trial
                            ends to continue service.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Payment Method</h4>
                      {subscription.stripe_customer_id ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600">Stripe Customer ID: {subscription.stripe_customer_id}</p>
                          <Button
                            onClick={() => {
                              toast({
                                title: "Coming Soon",
                                description: "Stripe integration for payment management is coming soon",
                              })
                            }}
                            variant="outline"
                            className="mt-3 border-[#F67721] text-[#F67721] hover:bg-[#F67721] hover:text-white"
                          >
                            Manage Payment Methods
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <p className="text-sm text-yellow-900 mb-3">No payment method on file</p>
                          <Button
                            onClick={() => {
                              toast({
                                title: "Coming Soon",
                                description: "Stripe payment setup is coming soon",
                              })
                            }}
                            className="bg-[#F67721] hover:bg-[#e56610]"
                          >
                            Add Payment Method
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Billing Address</h4>
                      {businessProfile?.address ? (
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-medium">{businessProfile.address}</p>
                          {(businessProfile.city || businessProfile.state || businessProfile.zip_code) && (
                            <p>
                              {businessProfile.city}
                              {businessProfile.city && businessProfile.state && ", "}
                              {businessProfile.state} {businessProfile.zip_code}
                            </p>
                          )}
                          {businessProfile.country && <p>{businessProfile.country}</p>}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No billing address on file. Update your business information to add a billing address.
                        </p>
                      )}
                      <Button
                        onClick={() => router.push("/settings?tab=business")}
                        variant="outline"
                        className="mt-3 border-gray-300 hover:bg-gray-50"
                      >
                        Update Billing Address
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => router.push("/pricing")}
                        variant="outline"
                        className="border-[#F67721] text-[#F67721] hover:bg-[#F67721] hover:text-white"
                      >
                        Change Plan
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No active subscription</p>
                    <Button onClick={() => router.push("/pricing")} className="bg-[#F67721] hover:bg-[#e56610]">
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
