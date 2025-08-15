import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/app/components/auth-provider"
import { OnboardingGate } from "@/app/components/onboarding-gate"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM",
  description: "Customer Relationship Management System",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <OnboardingGate>{children}</OnboardingGate>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
