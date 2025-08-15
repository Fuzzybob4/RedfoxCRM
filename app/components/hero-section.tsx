"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Star, Users, TrendingUp, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image src="/abstract-geometric-pattern.png" alt="" fill className="object-cover" priority />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-orange-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm">Trusted by 10,000+ businesses</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
                Customer Relationships
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              RedFox CRM helps landscaping and service businesses grow faster with powerful customer management,
              automated workflows, and intelligent insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-[#08042B] font-semibold px-8 py-4 text-lg"
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Users className="w-5 h-5 text-[#F67721]" />
                  <span className="text-2xl font-bold text-white">10K+</span>
                </div>
                <p className="text-gray-400 text-sm">Active Users</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#F67721]" />
                  <span className="text-2xl font-bold text-white">40%</span>
                </div>
                <p className="text-gray-400 text-sm">Revenue Growth</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#F67721]" />
                  <span className="text-2xl font-bold text-white">99.9%</span>
                </div>
                <p className="text-gray-400 text-sm">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Image
                src="/modern-crm-dashboard.png"
                alt="RedFox CRM Dashboard Preview"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-bounce">
              <div className="text-sm font-medium">Revenue Up</div>
              <div className="text-2xl font-bold">+32%</div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg animate-bounce delay-1000">
              <div className="text-sm font-medium">New Customers</div>
              <div className="text-2xl font-bold">+127</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  )
}
