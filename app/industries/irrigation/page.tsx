import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Droplets,
  Wrench,
  Calendar,
  Gauge,
  Settings,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: Calendar,
    title: "Seasonal Activation",
    description: "Schedule spring startups and fall winterizations with automated reminders and crew assignments.",
  },
  {
    icon: Wrench,
    title: "System Diagnostics",
    description: "Track system performance, identify issues, and schedule repairs with detailed diagnostic reports.",
  },
  {
    icon: Gauge,
    title: "Water Usage Monitoring",
    description: "Monitor water usage patterns and help customers optimize their irrigation efficiency.",
  },
  {
    icon: Settings,
    title: "Maintenance Scheduling",
    description: "Schedule regular maintenance, head adjustments, and system inspections throughout the season.",
  },
  {
    icon: Shield,
    title: "Warranty Management",
    description: "Track warranty periods for installations and components with automated renewal reminders.",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description: "Give customers access to their system information, maintenance schedules, and service history.",
  },
]

const services = [
  {
    title: "System Installation",
    description: "New irrigation system design and installation for residential and commercial properties",
    features: ["Site surveys", "Design proposals", "Installation tracking", "System testing"],
    icon: Settings,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Seasonal Services",
    description: "Spring activation, summer maintenance, and fall winterization services",
    features: ["Spring startups", "System inspections", "Winterization", "Seasonal adjustments"],
    icon: Calendar,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Repair & Maintenance",
    description: "Emergency repairs, routine maintenance, and system upgrades",
    features: ["Emergency repairs", "Head replacements", "Controller programming", "System upgrades"],
    icon: Wrench,
    color: "from-blue-600 to-indigo-500",
  },
]

const testimonials = [
  {
    name: "Carlos Rivera",
    company: "Rivera Irrigation Systems",
    location: "Phoenix, AZ",
    image: "/professional-man-headshot.png",
    quote:
      "RedFox CRM helps us manage 500+ irrigation systems. The seasonal scheduling feature ensures we never miss a startup or winterization.",
    results: "500+ systems managed",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    company: "Desert Sprinkler Solutions",
    location: "Las Vegas, NV",
    image: "/professional-woman-headshot.png",
    quote:
      "Water usage tracking helps our customers save money and us provide better service. It's a win-win for everyone.",
    results: "25% water savings",
    rating: 5,
  },
]

const stats = [
  { label: "Irrigation Contractors", value: "600+", icon: Droplets },
  { label: "Systems Managed", value: "40K+", icon: Settings },
  { label: "Average Water Savings", value: "22%", icon: Gauge },
  { label: "Service Efficiency", value: "+45%", icon: Clock },
]

export default function IrrigationPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5F906]/20 to-[#92E138]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#F67721]/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-500/20 text-cyan-400 border-blue-500/30 text-lg px-4 py-2">
              Irrigation CRM
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Streamline Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                Irrigation Business
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From system installations to seasonal maintenance, RedFox CRM helps irrigation professionals manage
              systems, track water usage, and provide exceptional service year-round.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-cyan-600 text-white" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-blue-500 hover:bg-blue-500/10 bg-transparent"
                asChild
              >
                <Link href="/contact-sales">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Complete Irrigation Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to install, maintain, and optimize irrigation systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 border-cyan-500/20 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">All Your Irrigation Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From new installations to seasonal maintenance, manage every aspect of your irrigation business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="bg-white/5 border-cyan-500/20 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how irrigation professionals are growing their businesses with RedFox CRM
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-cyan-500/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#F5F906] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.company}</div>
                        <div className="text-xs text-blue-400">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">{testimonial.results}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 via-[#08042B] to-cyan-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Optimize Your Irrigation Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join over 600 irrigation professionals who trust RedFox CRM to manage their systems and grow their
              business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-cyan-600 text-white" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-blue-500 hover:bg-blue-500/10 bg-transparent"
                asChild
              >
                <Link href="/contact-sales">Contact Sales</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  )
}
