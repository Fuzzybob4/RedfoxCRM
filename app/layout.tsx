import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./components/auth-provider"
import { AuthGate } from "./components/auth-gate"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Customer Relationship Management",
  description: "Professional CRM solution for managing customers, invoices, and business operations",
  icons: {
    icon: "/favicon.png",
  },
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
        <AuthGate>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </AuthGate>
      </body>
    </html>
  )
}
