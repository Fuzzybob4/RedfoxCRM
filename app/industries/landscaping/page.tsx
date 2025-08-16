import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TreePine,
  Route,
  Calendar,
  Scissors,
  Truck,
  Leaf,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: Route,
    title: "Route Optimization",
    description:
      "Optimize crew routes for maximum efficiency, reducing drive time and fuel costs while serving more customers.",
  },
  {
    icon: Calendar,
    title: "Seasonal Scheduling",
    description:
      "Manage seasonal services like spring cleanups, fall leaf removal, and winter snow removal with automated scheduling.",
  },
  {
    icon: Scissors,
    title: "Service Tracking",
    description:
      "Track mowing schedules, fertilizer applications, and maintenance tasks with detailed service history.",
  },
  {
    icon: Truck,
    title: "Equipment Management",
    description: "Monitor equipment usage, maintenance schedules, and fuel consumption across your fleet.",
  },
  {
    icon: Leaf,
    title: "Property Profiles",
    description:
      "Detailed property profiles with photos, service notes, and customer preferences for consistent service.",
  },
  {
    icon: Users,
    title: "Crew Management",
    description: "Assign crews to routes, track hours worked, and manage payroll with integrated time tracking.",
  },
]

const services = [
  {
    title: "Lawn Care & Maintenance",
    description: "Weekly mowing, edging, and basic lawn maintenance services",
    features: ["Mowing schedules", "Edging & trimming", "Leaf removal", "Basic fertilization"],
    icon: Scissors,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Landscape Design & Installation",
    description: "Custom landscape design, plant installation, and hardscaping projects",
    features: ["Design proposals", "Plant selection", "Installation tracking", "Project management"],
    icon: TreePine,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Seasonal Services",
    description: "Spring cleanups, fall leaf removal, and seasonal property maintenance",
    features: ["Spring cleanups", "Fall leaf removal", "Seasonal planting", "Winter services"],
    icon: Leaf,
    color: "from-yellow-500 to-orange-500",
  },
]

const testimonials = [
  {
    name: "Tom Wilson",
    company: "Wilson Lawn & Landscape",
    location: "Nashville, TN",
    image: "/professional-man-headshot-2.png",
    quote:
      "Route optimization increased our efficiency by 40%. We're serving 30% more customers with the same crew size.",
    results: "+40% efficiency",
    rating: 5,
  },
  {
    name: "Maria Gonzalez",
    company: "Green Thumb Landscaping",
    location: "San Antonio, TX",
    image: "/professional-woman-headshot-2.png",
    quote: "The seasonal scheduling feature keeps us organized year-round. Our customers love the consistent service.",
    results: "200+ properties managed",
    rating: 5,
  },
]

const stats = [
  { label: "Landscaping Companies", value: "1,500+", icon: TreePine },
  { label: "Properties Managed", value: "100K+", icon: MapPin },
  { label: "Average Route Efficiency", value: "+35%", icon: Route },
  { label: "Customer Retention", value: "89%", icon: Users },
]

export default function LandscapingPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5F906]/20 to-[#92E138]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#F67721]/10 to-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-green-500/20 text-emerald-400 border-green-500/30 text-lg px-4 py-2">
              Landscaping CRM
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Grow Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                Landscaping Business
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From route optimization to seasonal scheduling, RedFox CRM helps landscaping and lawn care professionals
              streamline operations, manage crews, and deliver consistent service to every property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-emerald-600 text-white" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-green-500 hover:bg-green-500/10 bg-transparent"
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
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Complete Landscaping Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage routes, crews, and customers for your landscaping business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-emerald-500/20 hover:bg-white/10 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Manage All Your Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From basic lawn care to complex landscape installations, RedFox CRM handles it all
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-white/5 border-emerald-500/20 hover:bg-white/10 transition-all duration-300"
              >
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
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
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
              See how landscaping professionals are growing their businesses with RedFox CRM
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-emerald-500/20">
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
                        <div className="text-xs text-green-400">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">{testimonial.results}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-900/20 via-[#08042B] to-emerald-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Grow Your Landscaping Business?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join over 1,500 landscaping professionals who trust RedFox CRM to manage their operations and grow their
              business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-emerald-600 text-white" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-green-500 hover:bg-green-500/10 bg-transparent"
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
