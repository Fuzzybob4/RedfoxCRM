"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        toast({
          title: "Invalid Session",
          description: "Please request a new password reset link.",
          variant: "destructive",
        })
        router.push("/reset-password")
      }
    }
    checkSession()
  }, [router, toast, supabase])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        throw error
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Password Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08042B] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Update Your Password</h1>
          <p className="mt-2 text-sm text-gray-400">Enter your new password below.</p>
        </div>
        <form onSubmit={handleUpdatePassword} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="new-password" className="text-white">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
