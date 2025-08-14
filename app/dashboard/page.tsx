"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          router.push(`/dashboard/${user.id}`)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error checking user:", error)
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen bg-[#08042B] text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
