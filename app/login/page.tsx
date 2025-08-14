import { Suspense } from "react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#08042B] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
