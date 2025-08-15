import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./components/auth-provider"
import { OnboardingGate } from "./components/onboarding-gate"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Professional Customer Management",
  description: "Streamline your business with RedFox CRM's powerful customer management tools",
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
          {children}
          <OnboardingGate />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
