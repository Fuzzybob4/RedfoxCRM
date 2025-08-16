import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08042B] via-[#0A0B2E] to-[#1A0B3D] text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F67721] mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Customer Features</h2>
          <p className="text-gray-400">Please wait while we prepare the page...</p>
        </div>

        {/* Loading skeleton */}
        <div className="mt-16 space-y-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
