"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Building2, CreditCard, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  full_name?: string
  email?: string
  avatar_url?: string
}

interface BusinessProfile {
  business_name?: string
  phone?: string
  email?: string
}

interface Subscription {
  plan_type: string
  billing_period: string
  status: string
  trial_end?: string
  current_period_end?: string
  amount?: number
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    getProfileData()
  }, [])

  async function getProfileData() {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Fetch user profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Fetch org_id from user_memberships
      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (membership?.org_id) {
        // Fetch business profile
        const { data: businessData } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("org_id", membership.org_id)
          .single()

        if (businessData) {
          setBusinessProfile(businessData)
        }

        // Fetch subscription
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("org_id", membership.org_id)
          .single()

        if (subData) {
          setSubscription(subData)
        }
      }
    } catch (error) {
      console.error("Error loading profile data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-500",
      trial: "bg-blue-500",
      past_due: "bg-yellow-500",
      canceled: "bg-red-500",
    }
    return (
      <Badge className={`${statusColors[status] || "bg-gray-500"} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPlanDisplay = (planType: string) => {
    const planNames: Record<string, string> = {
      starter: "Starter",
      professional: "Professional",
      enterprise: "Enterprise",
    }
    return planNames[planType] || planType
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center">
        <div className="text-gray-700">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F2EA] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View your account information</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-[#F67721]">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt="Profile picture" />
                <AvatarFallback className="bg-[#F67721] text-white text-2xl">
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile?.full_name || "User"}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                <Button onClick={() => router.push("/settings")} className="bg-[#F67721] hover:bg-[#e56610]">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information Card */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Building2 className="w-5 h-5 text-[#F67721]" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Business Name</p>
              <p className="text-gray-900">{businessProfile?.business_name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Business Email</p>
              <p className="text-gray-900">{businessProfile?.email || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Business Phone</p>
              <p className="text-gray-900">{businessProfile?.phone || "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <CreditCard className="w-5 h-5 text-[#F67721]" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Plan</p>
                    <p className="text-xl font-bold text-gray-900">{getPlanDisplay(subscription.plan_type)}</p>
                  </div>
                  <div>{getStatusBadge(subscription.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Billing</p>
                  <p className="text-gray-900">
                    ${subscription.amount?.toFixed(2)} / {subscription.billing_period}
                  </p>
                </div>
                {subscription.status === "trial" && subscription.trial_end && (
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Trial ends on {new Date(subscription.trial_end).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {subscription.status === "active" && subscription.current_period_end && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Next Billing Date</p>
                    <p className="text-gray-900">{new Date(subscription.current_period_end).toLocaleDateString()}</p>
                  </div>
                )}
                <Button
                  onClick={() => router.push("/settings?tab=billing")}
                  variant="outline"
                  className="w-full border-[#F67721] text-[#F67721] hover:bg-[#F67721] hover:text-white"
                >
                  Manage Subscription
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">No active subscription</p>
                <Button onClick={() => router.push("/pricing")} className="bg-[#F67721] hover:bg-[#e56610]">
                  View Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
