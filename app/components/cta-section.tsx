import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#08042B] via-[#0A0B2E] to-[#08042B] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
              Home Services Business?
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful businesses using RedFox CRM to streamline operations, delight customers, and
            accelerate growth.
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-[#F5F906]" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-[#F5F906]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-[#F5F906]" />
              <span>Setup in under 10 minutes</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white border-0 text-lg px-8 py-6"
            >
              <Link href="/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent text-lg px-8 py-6"
            >
              <Link href="/contact-sales">Talk to Sales</Link>
            </Button>
          </div>

          <p className="text-white/60 text-sm mt-6">
            Questions?{" "}
            <Link href="/contact-sales" className="text-[#F5F906] hover:text-white">
              Contact our sales team
            </Link>{" "}
            for a personalized demo.
          </p>
        </div>
      </div>
    </section>
  )
}
