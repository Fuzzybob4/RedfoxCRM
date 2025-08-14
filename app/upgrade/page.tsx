import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UpgradePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#08042B] text-white">
      <h1 className="text-4xl font-bold mb-4">Upgrade Your Plan</h1>
      <p className="text-xl mb-8">You need to upgrade your plan to access this feature.</p>
      <div className="space-x-4">
        <Button asChild className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B]">
          <Link href="/pricing">View Pricing Plans</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

