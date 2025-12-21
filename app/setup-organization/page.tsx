"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Building2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SetupOrganizationPage() {
  const [companyName, setCompanyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    checkExistingOrg()
  }, [])

  const checkExistingOrg = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      // Check if user already has an organization
      const { data: membership } = await supabase
        .from("user_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (membership?.org_id) {
        // User already has an org, redirect to dashboard
        router.replace("/dashboard")
        return
      }

      // Pre-fill company name from user metadata
      const meta = user.user_metadata
      if (meta?.company_name) {
        setCompanyName(meta.company_name)
      }
    } catch (error) {
      console.error("Error checking organization:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleSetupOrganization = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      // Try using the provision function first
      const { data: orgId, error: provisionError } = await supabase.rpc("provision_user_organization", {
        target_user_id: user.id,
      })

      if (provisionError) {
        console.error("Provision error:", provisionError)

        // Fallback: Create organization manually
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({ name: companyName.trim() })
          .select("id")
          .single()

        if (orgError) {
          throw new Error("Failed to create organization: " + orgError.message)
        }

        // Create membership
        const { error: membershipError } = await supabase.from("user_memberships").insert({
          user_id: user.id,
          org_id: org.id,
          role: "owner",
        })

        if (membershipError) {
          throw new Error("Failed to create membership: " + membershipError.message)
        }

        // Create business profile
        await supabase.from("business_profiles").insert({
          org_id: org.id,
          business_name: companyName.trim(),
          email: user.email,
        })

        // Create profile
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          role: "owner",
        })
      }

      toast({
        title: "Success!",
        description: "Your organization has been created.",
      })

      router.replace("/dashboard")
    } catch (error) {
      console.error("Setup error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08042B] to-[#1a1f3a]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-400 mx-auto mb-4" />
          <p className="text-white">Checking your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08042B] to-[#1a1f3a] p-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-500/20 rounded-full w-fit">
            <Building2 className="h-8 w-8 text-orange-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Set Up Your Organization</CardTitle>
          <CardDescription className="text-gray-400">
            Let's create your business workspace to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white">
              Company / Business Name
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your business name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Button
            onClick={handleSetupOrganization}
            disabled={isLoading}
            className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Organization"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
