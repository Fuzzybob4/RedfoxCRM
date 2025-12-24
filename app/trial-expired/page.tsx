"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function TrialExpiredPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (membership?.org_id) {
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("org_id", membership.org_id)
          .single()

        if (subData) {
          setSubscription(subData)

          // If subscription is active, redirect to dashboard
          if (subData.status === "active") {
            router.push("/dashboard")
            return
          }
        }
      }
    } catch (error) {
      console.error("Error checking subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPaymentMethod = () => {
    toast({
      title: "Coming Soon",
      description: "Stripe payment integration is coming soon",
    })
    // TODO: Integrate with Stripe to add payment method
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center">
        <div className="text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Your Trial Has Ended</CardTitle>
          <CardDescription className="text-gray-600">
            Your 30-day free trial has expired. Add a payment method to continue using RedFox CRM.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Your Plan</h3>
              <p className="text-lg font-bold text-gray-900">
                {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)}
              </p>
              <p className="text-sm text-gray-600">
                ${subscription.amount?.toFixed(2)} / {subscription.billing_period}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Access to all features</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Unlimited customers & projects</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Priority support</span>
            </div>
          </div>

          <Button onClick={handleAddPaymentMethod} className="w-full bg-[#F67721] hover:bg-[#e56610]" size="lg">
            Add Payment Method
          </Button>

          <Button
            onClick={() => router.push("/pricing")}
            variant="outline"
            className="w-full border-gray-300"
            size="lg"
          >
            View All Plans
          </Button>

          <div className="text-center">
            <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-500 hover:text-gray-700">
              Return to Dashboard
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
