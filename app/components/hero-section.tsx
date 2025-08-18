import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The Complete CRM for{" "}
            <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
              Home Services
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your holiday lighting, outdoor lighting, landscaping, and irrigation business with our all-in-one
            customer management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#F67721] to-[#F5F906] text-black font-semibold hover:opacity-90 transition-opacity"
            >
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="/features">View Features</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>14-Day Free Trial</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
