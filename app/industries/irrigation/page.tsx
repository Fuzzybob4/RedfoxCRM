import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Droplets,
  Settings,
  Calendar,
  AlertTriangle,
  BarChart3,
  Wrench,
  DollarSign,
  Star,
  ArrowRight,
  Gauge,
} from "lucide-react"

const features = [
  {
    icon: Settings,
    title: "System Diagnostics",
    description:
      "Monitor irrigation system health, pressure levels, and identify potential issues before they become problems.",
  },
  {
    icon: Calendar,
    title: "Seasonal Activation & Winterization",
    description: "Schedule spring startups and fall winterization services with automated customer notifications.",
  },
  {
    icon: Wrench,
    title: "Repair & Maintenance Tracking",
    description: "Track repairs, replacement parts, and maintenance history for each irrigation zone and system.",
  },
  {
    icon: BarChart3,
    title: "Water Usage Monitoring",
    description: "Monitor water consumption, identify inefficiencies, and help customers optimize their usage.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Response",
    description: "Quick response system for broken pipes, malfunctioning zones, and emergency repairs.",
  },
  {
    icon: DollarSign,
    title: "Service Contracts",
    description: "Manage seasonal contracts, maintenance agreements, and recurring inspection schedules.",
  },
]

const benefits = [
  {
    stat: "38%",
    label: "Faster Response",
    description: "Emergency repair coordination",
  },
  {
    stat: "25%",
    label: "More Contracts",
    description: "Better customer retention and upselling",
  },
  {
    stat: "45%",
    label: "Reduced Callbacks",
    description: "Proactive maintenance and diagnostics",
  },
]

const testimonials = [
  {
    name: "Robert Kim",
    company: "AquaTech Irrigation",
    quote:
      "RedFox CRM transformed our irrigation business. We can now monitor 300+ systems and respond to issues before customers even notice.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    company: "Smart Sprinkler Solutions",
    quote:
      "The seasonal activation scheduling feature alone has saved us countless hours and improved our customer satisfaction dramatically.",
    rating: 5,
  },
]

export default function IrrigationPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              Irrigation & Sprinkler CRM
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Optimize Your{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Irrigation
              </span>{" "}
              Operations
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From system diagnostics to seasonal maintenance, RedFox CRM helps irrigation professionals manage water
              systems efficiently, reduce callbacks, and keep landscapes thriving year-round.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Irrigation System Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Monitor, maintain, and optimize irrigation systems with precision and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
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
              Proven Results for Irrigation Professionals
            </h2>
            <p className="text-xl text-gray-300">See how RedFox CRM transforms irrigation and sprinkler businesses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Irrigation Professionals Say</h2>
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

      {/* Service Cycle Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Irrigation Service Cycle</h2>
            <p className="text-xl text-gray-300">
              From spring startup to winter shutdown, manage every aspect of irrigation maintenance.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Spring Startup",
                  desc: "System activation, pressure testing, zone calibration",
                  icon: Settings,
                },
                {
                  step: "2",
                  title: "Summer Monitoring",
                  desc: "Performance tracking, water usage optimization",
                  icon: Gauge,
                },
                {
                  step: "3",
                  title: "Repair & Maintenance",
                  desc: "Quick response repairs, preventive maintenance",
                  icon: Wrench,
                },
                {
                  step: "4",
                  title: "Winter Shutdown",
                  desc: "System winterization, pipe blowouts, protection",
                  icon: AlertTriangle,
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Droplets className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Streamline Your Irrigation Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join irrigation professionals who trust RedFox CRM to manage their systems, reduce callbacks, and grow
              their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white"
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
    </div>
  )
}
