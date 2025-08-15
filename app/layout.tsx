import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { AuthProvider } from "./components/auth-provider"
import { OnboardingGate } from "./components/onboarding-gate"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Transform Your Customer Relationships",
  description:
    "RedFox CRM helps landscaping and service businesses grow faster with powerful customer management, automated workflows, and intelligent insights.",
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
          <OnboardingGate>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </OnboardingGate>
        </AuthProvider>
      </body>
    </html>
  )
}
