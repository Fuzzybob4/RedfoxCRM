import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"

export default function KnowledgeBaseLoading() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section Skeleton */}
        <section className="bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69] text-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-12 sm:h-16 w-3/4 sm:w-1/2 mx-auto mb-4 sm:mb-6 bg-white/10" />
            <Skeleton className="h-6 sm:h-8 w-full sm:w-3/4 mx-auto mb-6 sm:mb-8 bg-white/10" />

            {/* Search Bar Skeleton */}
            <div className="max-w-2xl mx-auto px-4">
              <Skeleton className="h-12 sm:h-16 w-full bg-white/10" />
            </div>
          </div>
        </section>

        {/* Categories Section Skeleton */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <Skeleton className="h-8 sm:h-10 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-6 w-3/4 sm:w-1/2 mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start sm:items-center space-x-4">
                      <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles Section Skeleton */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <Skeleton className="h-8 sm:h-10 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-6 w-3/4 sm:w-1/2 mx-auto" />
            </div>

            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-6 w-full sm:w-3/4 mb-2" />
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <div className="flex-shrink-0 sm:ml-4">
                        <Skeleton className="h-8 w-20 sm:w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Skeleton className="h-10 w-40 mx-auto" />
            </div>
          </div>
        </section>

        {/* Quick Links Section Skeleton */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <Skeleton className="h-8 sm:h-10 w-1/3 mx-auto mb-4" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="text-center h-full">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 rounded" />
                    <Skeleton className="h-5 w-3/4 mx-auto mb-1 sm:mb-2" />
                    <Skeleton className="h-4 w-full mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section Skeleton */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-8 sm:h-10 w-1/2 mx-auto mb-4 sm:mb-6 bg-white/20" />
            <Skeleton className="h-6 w-3/4 sm:w-1/2 mx-auto mb-6 sm:mb-8 bg-white/20" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Skeleton className="h-10 w-full sm:w-32 bg-white/20" />
              <Skeleton className="h-10 w-full sm:w-32 bg-white/20" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
