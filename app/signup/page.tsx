"use client"

import { Suspense } from "react"
import SignUpForm from "./SignUpForm"
import { useScrollToTop } from "../hooks/useScrollToTop"

function SignUpContent() {
  useScrollToTop()
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-white">Create your account</h2>
        <p className="mt-2 text-sm text-gray-400">Join RedFox CRM and streamline your business operations</p>
      </div>
      <Suspense fallback={<div className="text-white">Loading form...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#08042B] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <SignUpContent />
      </Suspense>
    </div>
  )
}
