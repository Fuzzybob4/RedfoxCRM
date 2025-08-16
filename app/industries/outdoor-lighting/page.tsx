import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  PenTool,
  Wrench,
  Calendar,
  Camera,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: PenTool,
    title: "Design & Proposals",
    description: "Create professional lighting design proposals with photos, diagrams, and detailed cost breakdowns.",
  },
  {
    icon: Calendar,
    title: "Installation Scheduling",
    description: "Schedule installations, assign crews, and track project progress from start to finish.",
  },
  {
    icon: Camera,
    title: "Photo Documentation",
    description: "Before/after photos, progress updates, and installation documentation for every project.",
  },
  {
    icon: Wrench,
    title: "Maintenance Management",
    description: "Schedule regular maintenance, track warranty periods, and manage service calls efficiently.",
  },
  {
    icon: Shield,
    title: "Warranty Tracking",
    description: "Track warranty periods for fixtures, bulbs, and installations with automated reminders.",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description: "Give customers access to their project status, maintenance schedules, and service history.",
  },
]

const projectTypes = [
  {
    title: "Residential Landscape Lighting",
    description: "Pathway lighting, accent lighting, and security lighting for homes",
    features: ["Design consultations", "Installation scheduling", "Maintenance programs", "Warranty management"],
    icon: Lightbulb,
  },
  {
    title: "Commercial Outdoor Lighting",
    description: "Parking lot lighting, building facades, and security lighting for businesses",
    features: ["Site surveys", "Compliance tracking", "Energy audits", "Service contracts"],
    icon: Shield,
  },
  {
    title: "Architectural Lighting",
    description: "Decorative and accent lighting for buildings and landscapes",
    features: ["3D design mockups", "Custom fixtures", "Installation coordination", "Ongoing support"],
    icon: PenTool,
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    company: "Illuminate Outdoor Lighting",
    location: "Austin, TX",
    image: "/professional-woman-headshot.png",
    quote:
      "RedFox CRM transformed our proposal process. We're closing 40% more deals with professional presentations and follow-up automation.",
    results: "+40% close rate",
    rating: 5,
  },
  {
    name: "David Martinez",
    company: "Nightscape Lighting Design",
    location: "Phoenix, AZ",
    image: "/professional-man-headshot-2.png",
    quote:
      "The maintenance scheduling feature keeps our customers happy and generates consistent recurring revenue throughout the year.",
    results: "$50K+ recurring revenue",
    rating: 5,
  },
]

const stats = [
  { label: "Lighting Contractors", value: "800+", icon: Lightbulb },
  { label: "Projects Managed", value: "25K+", icon: PenTool },
  { label: "Average Project Value", value: "$8,500", icon: DollarSign },
  { label: "Customer Satisfaction", value: "96%", icon: Star },
]

export default function OutdoorLightingPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5F906]/20 to-[#92E138]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#F67721]/10 to-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-yellow-500/20 text-orange-400 border-yellow-500/30 text-lg px-4 py-2">
              Outdoor Lighting CRM
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Illuminate Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                Lighting Business
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From design proposals to maintenance management, RedFox CRM helps outdoor lighting professionals create
              stunning installations, manage projects, and build lasting customer relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-600 hover:bg-orange-600 text-white" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-yellow-500 hover:bg-yellow-500/10 bg-transparent"
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
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Complete Outdoor Lighting Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to design, install, and maintain professional outdoor lighting systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-orange-500/20 hover:bg-white/10 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Project Types */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Specialized for Every Project Type</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether residential, commercial, or architectural, RedFox CRM adapts to your lighting projects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projectTypes.map((project, index) => (
              <Card
                key={index}
                className="bg-white/5 border-orange-500/20 hover:bg-white/10 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <project.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">{project.title}</CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
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
              See how outdoor lighting professionals are growing their businesses with RedFox CRM
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-orange-500/20">
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
                        <div className="text-xs text-yellow-400">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{testimonial.results}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-900/20 via-[#08042B] to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Brighten Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join over 800 outdoor lighting professionals who trust RedFox CRM to manage their projects and grow their
              business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-600 hover:bg-orange-600 text-white" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-yellow-500 hover:bg-yellow-500/10 bg-transparent"
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
