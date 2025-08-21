import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./components/auth-provider"
import { AuthGate } from "./components/auth-gate"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Complete Customer Relationship Management Solution",
  description:
    "Streamline your customer relationships, boost sales, and grow your business with RedFox CRM. Trusted by 10,000+ businesses worldwide.",
  keywords: [
    "CRM",
    "customer relationship management",
    "sales automation",
    "business growth",
    "customer management",
    "sales pipeline",
    "lead management",
    "contact management",
  ],
  authors: [{ name: "RedFox CRM Team" }],
  creator: "RedFox CRM",
  publisher: "RedFox CRM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RedFox CRM - Complete Customer Relationship Management Solution",
    description:
      "Streamline your customer relationships, boost sales, and grow your business with RedFox CRM. Trusted by 10,000+ businesses worldwide.",
    url: "/",
    siteName: "RedFox CRM",
    images: [
      {
        url: "/image/home/modern-crm-dashboard.png",
        width: 1200,
        height: 630,
        alt: "RedFox CRM Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RedFox CRM - Complete Customer Relationship Management Solution",
    description: "Streamline your customer relationships, boost sales, and grow your business with RedFox CRM.",
    images: ["/image/home/modern-crm-dashboard.png"],
    creator: "@redfoxcrm",
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
  icons: {
    icon: [
      { url: "/image/favicon/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/image/favicon/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/image/favicon/favicon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/image/favicon/favicon.png",
  },
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/image/favicon/favicon.png" />
        <link rel="apple-touch-icon" href="/image/favicon/favicon.png" />
      </head>
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
