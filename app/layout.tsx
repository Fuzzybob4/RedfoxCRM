import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./components/auth-provider"
import { OnboardingGate } from "./components/onboarding-gate"
import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Professional Customer Management",
  description:
    "Streamline your business with RedFox CRM. Manage customers, projects, estimates, and invoices all in one place.",
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
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </OnboardingGate>
        </AuthProvider>
      </body>
    </html>
  )
}
