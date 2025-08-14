import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"

export default async function CurrentMonthReportPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#1a1f2c] text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Current Month Report</h1>
        <Card className="p-6 bg-white/10 border-white/20">
          <p className="text-gray-300">Current month report data will be displayed here.</p>
        </Card>
      </div>
    </div>
  )
}
