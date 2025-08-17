import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/app/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Home Services Management Platform",
  description: "Complete CRM solution for holiday lighting, outdoor lighting, landscaping, and irrigation businesses",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
