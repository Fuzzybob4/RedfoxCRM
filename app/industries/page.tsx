import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TreePine, Droplets, Calendar, Users, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"

const industries = [
  {
    title: "Holiday Lighting",
    description:
      "Seasonal installation management, equipment tracking, and customer scheduling for holiday lighting professionals.",
    icon: Lightbulb,
    href: "/industries/holiday-lighting",
    color: "from-red-500 to-green-500",
    features: ["Seasonal Contracts", "Installation Scheduling", "Take-Down Reminders", "Equipment Inventory"],
    stats: { customers: "2,500+", revenue: "$180K", efficiency: "40%" },
  },
  {
    title: "Outdoor Lighting",
    description: "Year-round landscape lighting design, installation tracking, and maintenance management.",
    icon: Lightbulb,
    href: "/industries/outdoor-lighting",
    color: "from-yellow-500 to-orange-500",
    features: ["Design Proposals", "Installation Tracking", "Maintenance Schedules", "Warranty Management"],
    stats: { customers: "1,800+", revenue: "$220K", efficiency: "35%" },
  },
  {
    title: "Landscaping & Lawn Care",
    description: "Complete landscaping operations with route optimization, seasonal services, and crew management.",
    icon: TreePine,
    href: "/industries/landscaping",
    color: "from-green-500 to-emerald-600",
    features: ["Route Optimization", "Seasonal Services", "Crew Management", "Equipment Tracking"],
    stats: { customers: "3,200+", revenue: "$320K", efficiency: "45%" },
  },
  {
    title: "Irrigation & Sprinklers",
    description:
      "Irrigation system diagnostics, seasonal activation, and water usage monitoring for efficient operations.",
    icon: Droplets,
    href: "/industries/irrigation",
    color: "from-blue-500 to-cyan-500",
    features: ["System Diagnostics", "Seasonal Activation", "Repair Tracking", "Water Usage Reports"],
    stats: { customers: "1,400+", revenue: "$160K", efficiency: "38%" },
  },
]

const benefits = [
  {
    icon: Calendar,
    title: "Seasonal Management",
    description: "Handle seasonal contracts, installations, and maintenance with automated scheduling and reminders.",
  },
  {
    icon: Users,
    title: "Crew Coordination",
    description: "Manage multiple crews, track their locations, and optimize routes for maximum efficiency.",
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "Scale your operations with data-driven insights and automated workflows that grow with you.",
  },
]

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4 bg-gradient-to-r from-[#F67721] to-[#F5F906] text-white">
                Specialized Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Built for{" "}
                <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
                  Lighting & Landscaping
                </span>{" "}
                Professionals
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                RedFox CRM is specifically designed for outdoor service professionals. From holiday lighting
                installations to year-round landscaping operations, we understand your unique challenges and workflows.
              </p>
            </div>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {industries.map((industry, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${industry.color} flex items-center justify-center`}
                      >
                        <industry.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{industry.title}</CardTitle>
                        <CardDescription className="text-gray-400">{industry.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-white mb-3">Key Features</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {industry.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-800">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{industry.stats.customers}</div>
                          <div className="text-xs text-gray-400">Customers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{industry.stats.revenue}</div>
                          <div className="text-xs text-gray-400">Avg Revenue</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">+{industry.stats.efficiency}</div>
                          <div className="text-xs text-gray-400">Efficiency</div>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
                      >
                        <Link href={industry.href} className="flex items-center justify-center space-x-2">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-900/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose RedFox for Your Industry?</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We understand the unique challenges of outdoor service businesses and built our CRM specifically for
                your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of lighting and landscaping professionals who trust RedFox CRM to grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
              >
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Link href="/contact-sales">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
