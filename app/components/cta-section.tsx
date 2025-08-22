"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const benefits = [
  {
    icon: Users,
    title: "10,000+ Happy Customers",
    description: "Join thousands of outdoor professionals",
  },
  {
    icon: TrendingUp,
    title: "35% Average Revenue Growth",
    description: "See measurable business improvements",
  },
  {
    icon: Clock,
    title: "15 Hours Saved Weekly",
    description: "Automate repetitive tasks",
  },
]

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#08042B] to-[#1a1f3a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of home service professionals who trust RedFox CRM to grow their business. Start your free
          trial today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <Link href="/contact-sales">Contact Sales</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400 text-sm mt-12">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-slate-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-white mb-2">Trusted by Industry Leaders</h3>
              <p className="text-slate-400">See why outdoor professionals choose RedFox CRM</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <Image
                  src="/professional-woman-headshot.png"
                  alt="Customer testimonial"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-slate-600"
                />
                <Image
                  src="/professional-man-headshot.png"
                  alt="Customer testimonial"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-slate-600"
                />
                <Image
                  src="/professional-woman-headshot-2.png"
                  alt="Customer testimonial"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-slate-600"
                />
                <div className="w-10 h-10 bg-slate-600 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs text-slate-300 font-medium">
                  +10K
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-white text-sm font-medium">4.9/5</span>
                </div>
                <p className="text-slate-400 text-xs">From 2,500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
