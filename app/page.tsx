import { Button } from "@/components/ui/button"
import { PricingSection } from "./components/pricing-section"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function LandingPage() {
  // Test Supabase connection
  const { data, error } = await supabase.from("profiles").select("count").single()
  const profileCount = data ? data.count : 0

  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Hero Section */}
      <section className="pt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Welcome To Red Fox CRM. Streamline Your Workflow with Confidence!
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Powerful tools tailored to your business, available at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                  <Link href="/signup">Get Started with Red Fox CRM</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-[#F67721] hover:bg-[#F67721]/10"
                  asChild
                >
                  <Link href="/features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-[200px] md:h-[300px] rounded-lg overflow-hidden shadow-2xl group">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image2%20(2)-Nk8IQRfrISweXVpn3nPlB23Q5bFSy2.png"
                  alt="Professional Landscape Design"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <p className="text-white text-center text-sm">
                    Schedule services, track equipment maintenance, and manage client properties with ease.
                  </p>
                </div>
              </div>
              <div className="relative h-[200px] md:h-[300px] rounded-lg overflow-hidden shadow-2xl group">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image1%20(3)-20CuHGYsJ1q8wyDfqii1VZ1CiMSsLX.png"
                  alt="Holiday Lighting Installation"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <p className="text-white text-center text-sm">
                    Manage installations, track inventory, and coordinate teams effortlessly during peak seasons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Industry Solutions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-lg bg-white/5 p-8 border border-[#92E138]/20">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-4 text-white">Holiday Lighting</h3>
                <p className="text-gray-300 mb-6">
                  Streamline your seasonal lighting business with our specialized CRM solution. Manage installations,
                  maintenance, and customer relationships all in one place.
                </p>
                <Button className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                  <Link href="/features">Learn More</Link>
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#92E138]/5 to-[#F67721]/5 transform group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="group relative overflow-hidden rounded-lg bg-white/5 p-8 border border-[#92E138]/20">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-4 text-white">Lawn Care & Landscaping</h3>
                <p className="text-gray-300 mb-6">
                  Keep track of recurring maintenance, design projects, and client communications with our comprehensive
                  landscaping business management tools.
                </p>
                <Button className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                  <Link href="/features">Learn More</Link>
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#92E138]/5 to-[#F67721]/5 transform group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-[#F67721] mb-2">5K+</h3>
              <p className="text-gray-300">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#92E138] mb-2">98%</h3>
              <p className="text-gray-300">Customer Satisfaction</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#F5F906] mb-2">24/7</h3>
              <p className="text-gray-300">Support</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#F67721] mb-2">50M+</h3>
              <p className="text-gray-300">Tasks Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />
    </div>
  )
}
