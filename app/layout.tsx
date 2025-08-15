import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "./components/auth-provider"
import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { OnboardingGate } from "./components/onboarding-gate"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM",
  description: "Manage your holiday lighting and landscaping business efficiently",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#08042B] text-white min-h-screen flex flex-col`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <Header />
            <main className="pt-24 flex-grow">{children}</main>
            <Footer />
            <OnboardingGate />
          </AuthProvider>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
