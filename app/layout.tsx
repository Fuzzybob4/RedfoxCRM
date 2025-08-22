import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "./components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Transform Your Business",
  description:
    "Streamline your customer relationships, boost sales, and grow your business with our powerful CRM platform.",
  keywords: "CRM, customer relationship management, sales, business growth, customer management",
  authors: [{ name: "RedFox CRM Team" }],
  openGraph: {
    title: "RedFox CRM - Transform Your Business",
    description:
      "Streamline your customer relationships, boost sales, and grow your business with our powerful CRM platform.",
    url: "https://redfoxcrm.com",
    siteName: "RedFox CRM",
    images: [
      {
        url: "/image/home/hero.jpg",
        width: 1200,
        height: 630,
        alt: "RedFox CRM Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RedFox CRM - Transform Your Business",
    description:
      "Streamline your customer relationships, boost sales, and grow your business with our powerful CRM platform.",
    images: ["/image/home/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
