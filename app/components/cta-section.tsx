"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, Users } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of service businesses that have already streamlined their operations and accelerated their
            growth with RedFox CRM.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-[#08042B] font-semibold px-8 py-4 text-lg"
            >
              <Link href="/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
            >
              <Link href="/contact-sales">Schedule a Demo</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-[#F67721]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-300 text-sm">Enterprise-grade security with 99.9% uptime guarantee</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-[#F67721]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Setup</h3>
              <p className="text-gray-300 text-sm">Get up and running in minutes with our guided onboarding</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#F67721]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
              <p className="text-gray-300 text-sm">Dedicated support team to help you succeed every step of the way</p>
            </div>
          </div>

          {/* Final Trust Message */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-gray-300">
              <strong className="text-white">No setup fees.</strong> Cancel anytime.
              <strong className="text-white"> 14-day free trial</strong> with full access to all features.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
