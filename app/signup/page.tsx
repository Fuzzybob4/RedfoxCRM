import type { Metadata } from "next"
import SignUpClientPage from "./SignUpClientPage"

export const metadata: Metadata = {
  title: "Sign Up - RedFox CRM",
  description: "Create your RedFox CRM account and start transforming your business today.",
}

export default function SignUpPage() {
  return <SignUpClientPage />
}
