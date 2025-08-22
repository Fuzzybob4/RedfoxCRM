import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function KnowledgeBaseLoading() {
  return (
    <div className="pt-16">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-16 w-96 mx-auto mb-6 bg-white/10" />
          <Skeleton className="h-8 w-full max-w-3xl mx-auto mb-8 bg-white/10" />
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-16 w-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles Section Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Skeleton className="h-12 w-40 mx-auto" />
          </div>
        </div>
      </section>
    </div>
  )
}
