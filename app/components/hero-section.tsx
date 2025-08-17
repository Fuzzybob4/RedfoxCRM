import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#08042B] via-[#0A0B2E] to-[#0D1B2A]" />
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#F67721]/20 to-[#F5F906]/20 border border-[#F67721]/30">
                <span className="text-sm font-medium text-[#F5F906]">🚀 Transform Your Home Services Business</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Complete CRM for{" "}
                <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
                  Home Services
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Streamline your holiday lighting, outdoor lighting, landscaping, and irrigation business with powerful
                customer management, automated workflows, and intelligent insights.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white border-0 text-lg px-8 py-6"
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent text-lg px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/70">Active Businesses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/70">Jobs Managed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-white/70">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/modern-crm-dashboard.png"
                alt="RedFox CRM Dashboard"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F67721]/20 to-[#F5F906]/20 blur-3xl -z-10 scale-110" />
          </div>
        </div>
      </div>
    </section>
  )
}
