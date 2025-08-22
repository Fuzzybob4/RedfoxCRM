import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RedFox CRM - Transform Your Business Operations",
  description:
    "The all-in-one customer relationship management platform designed for modern businesses. Streamline operations, boost sales, and deliver exceptional customer experiences.",
  keywords: "CRM, customer relationship management, business software, sales management, customer tracking",
  authors: [{ name: "RedFox CRM Team" }],
  creator: "RedFox CRM",
  publisher: "RedFox CRM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://redfoxcrm.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RedFox CRM - Transform Your Business Operations",
    description:
      "The all-in-one customer relationship management platform designed for modern businesses. Streamline operations, boost sales, and deliver exceptional customer experiences.",
    url: "/",
    siteName: "RedFox CRM",
    images: [
      {
        url: "/image/home/modern-crm-dashboard.png",
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
    title: "RedFox CRM - Transform Your Business Operations",
    description: "The all-in-one customer relationship management platform designed for modern businesses.",
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
    icon: "/image/favicon/favicon.png",
    shortcut: "/image/favicon/favicon.png",
    apple: "/image/favicon/favicon.png",
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
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
