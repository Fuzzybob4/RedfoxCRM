"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ContactsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/customers")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecting to customers...</p>
    </div>
  )
}
