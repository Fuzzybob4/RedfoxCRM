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
  title: "Red Fox CRM - Streamline Your Business Workflow",
  description: "Powerful CRM tools tailored to your business, available at your fingertips.",
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
          <Header />
          <OnboardingGate>
            <main>{children}</main>
          </OnboardingGate>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
