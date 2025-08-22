"use client"

import SignUpForm from "./SignUpForm"
import { useScrollToTop } from "../hooks/useScrollToTop"
import { Header } from "../components/header"
import { Footer } from "../components/footer"

export default function SignUpPage() {
  useScrollToTop()

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="min-h-screen bg-[#08042B] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-white">Create your account</h2>
              <p className="mt-2 text-sm text-gray-400">Join RedFox CRM and streamline your business operations</p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
