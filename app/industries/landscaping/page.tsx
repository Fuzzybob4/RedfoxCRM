import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TreePine, Route, Users, Calendar, Truck, Leaf, DollarSign, Star, ArrowRight, Scissors } from 'lucide-react'
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"

const features = [
  {
    icon: Route,
    title: "Route Optimization",
    description: "Optimize crew routes for maximum efficiency and reduced fuel costs across all service areas.",
  },
  {
    icon: Calendar,
    title: "Seasonal Service Management",
    description: "Manage spring cleanups, summer maintenance, fall leaf removal, and winter preparations.",
  },
  {
    icon: Users,
    title: "Crew Management",
    description: "Assign crews to jobs, track their progress, and manage equipment across multiple teams.",
  },
  {
    icon: Truck,
    title: "Equipment Tracking",
    description: "Monitor mowers, trimmers, blowers, and other equipment across job sites and crews.",
  },
  {
    icon: Leaf,
    title: "Service Scheduling",
    description: "Automated scheduling for weekly mowing, bi-weekly maintenance, and seasonal services.",
  },
  {
    icon: DollarSign,
    title: "Contract Management",
    description: "Manage seasonal contracts, one-time services, and recurring maintenance agreements.",
  },
]

const benefits = [
  {
    stat: "45%",
    label: "More Efficient Routes",
    description: "Optimized scheduling and routing",
  },
  {
    stat: "30%",
    label: "Increased Revenue",
    description: "Better customer retention and upselling",
  },
  {
    stat: "40%",
    label: "Less Admin Time",
    description: "Automated scheduling and invoicing",
  },
]

const testimonials = [
  {
    name: "Carlos Martinez",
    company: "Green Thumb Landscaping",
    quote:
      "RedFox CRM helped us grow from 2 crews to 8 crews in 18 months. The route optimization alone saved us hours every day.",
    rating: 5,
  },
  {
    name: "Amanda Foster",
    company: "Premier Lawn Care",
    quote:
      "Managing 400+ weekly customers used to be a nightmare. Now it's completely automated and our customers love the service.",
    rating: 5,
  },
]

export default function LandscapingPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                Landscaping & Lawn Care CRM
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Grow Your{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Landscaping
                </span>{" "}
                Business
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                From route optimization to crew management, RedFox CRM helps landscaping and lawn care professionals
                streamline operations, manage seasonal services, and grow their customer base.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white"
                >
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                >
                  <Link href="/contact-sales">Schedule Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Complete Landscaping Operations Management
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to manage crews, routes, equipment, and customers efficiently.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">{feature.description}</CardDescription>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Proven Results for Landscaping Professionals
              </h2>
              <p className="text-xl text-gray-300">See how RedFox CRM transforms landscaping and lawn care businesses.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {benefit.stat}
                  </div>
                  <div className="text-xl font-semibold text-white mb-2">{benefit.label}</div>
                  <div className="text-gray-300">{benefit.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Landscaping Professionals Say</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-300 mb-4 italic">"{testimonial.quote}"</blockquote>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Services Section */}
        <section className="py-16 bg-gray-900/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Manage All Seasonal Services</h2>
              <p className="text-xl text-gray-300">
                From spring cleanups to winter preparations, stay organized year-round.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  {
                    season: "Spring",
                    title: "Spring Cleanup",
                    desc: "Debris removal, bed preparation, first cuts",
                    color: "from-green-400 to-green-600",
                  },
                  {
                    season: "Summer",
                    title: "Weekly Maintenance",
                    desc: "Mowing, trimming, weeding, irrigation",
                    color: "from-yellow-400 to-orange-500",
                  },
                  {
                    season: "Fall",
                    title: "Leaf Removal",
                    desc: "Leaf cleanup, winterization, final cuts",
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    season: "Winter",
                    title: "Snow Services",
                    desc: "Snow removal, salt application, planning",
                    color: "from-blue-400 to-blue-600",
                  },
                ].map((item, index) => (
                  <Card key={index} className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-4`}
                      >
                        <Scissors className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-white">{item.title}</CardTitle>
                      <CardDescription className="text-gray-400">{item.season}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <TreePine className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Grow Your Landscaping Business?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of landscaping professionals who trust RedFox CRM to streamline their operations and grow
                their business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white"
                >
                  <Link href="/signup" className="flex items-center space-x-2">
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
