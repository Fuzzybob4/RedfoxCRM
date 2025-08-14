"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function SignupSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to login after 10 seconds
    const timer = setTimeout(() => {
      router.push("/login")
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#08042B] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20 p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">Account Created Successfully! 🎉</h1>

        <div className="flex justify-center mb-4">
          <Mail className="h-8 w-8 text-[#F67721]" />
        </div>

        <p className="text-gray-300 mb-6">
          We've sent a verification email to your inbox. Please check your email and click the verification link to
          activate your account.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
            <Link href="/login">Go to Login</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Didn't receive the email? Check your spam folder or contact support.
        </p>

        <p className="text-xs text-gray-500 mt-4">You'll be automatically redirected to login in 10 seconds...</p>
      </Card>
    </div>
  )
}
