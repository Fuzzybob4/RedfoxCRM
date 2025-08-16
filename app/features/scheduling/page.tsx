import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Bell, Users, Repeat, MapPin, CheckCircle, ArrowRight, Star, Zap, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const schedulingFeatures = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "AI-powered scheduling that finds the best times for appointments based on availability and preferences.",
    benefits: ["AI optimization", "Availability sync", "Time zone handling", "Conflict prevention"],
  },
  {
    icon: Clock,
    title: "Automated Reminders",
    description: "Send automatic email and SMS reminders to reduce no-shows and keep everyone on schedule.",
    benefits: ["Email reminders", "SMS notifications", "Custom timing", "No-show reduction"],
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Get instant notifications for new bookings, cancellations, and schedule changes.",
    benefits: ["Instant alerts", "Mobile notifications", "Team updates", "Status changes"],
  },
  {
    icon: Users,
    title: "Team Coordination",
    description: "Coordinate schedules across your entire team with shared calendars and resource management.",
    benefits: ["Shared calendars", "Resource booking", "Team availability", "Workload balancing"],
  },
  {
    icon: Repeat,
    title: "Recurring Appointments",
    description: "Set up recurring appointments and maintenance schedules with flexible repeat patterns.",
    benefits: ["Flexible patterns", "Auto-scheduling", "Series management", "Exception handling"],
  },
  {
    icon: MapPin,
    title: "Location Management",
    description: "Manage multiple locations, service areas, and travel time between appointments.",
    benefits: ["Multi-location", "Travel time", "Service areas", "Route optimization"],
  },
]

const stats = [
  { label: "No-show Reduction", value: "73%", icon: Target },
  { label: "Booking Speed", value: "< 30sec", icon: Zap },
  { label: "Schedule Efficiency", value: "+45%", icon: Clock },
  { label: "Customer Satisfaction", value: "4.9/5", icon: Star },
]

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    company: "Chen Family Dentistry",
    image: "/professional-woman-headshot.png",
    quote:
      "Automated reminders reduced our no-shows by 73%. Our schedule is now fully optimized and patients love the convenience.",
    rating: 5,
  },
  {
    name: "Mike Thompson",
    company: "Thompson Plumbing",
    image: "/professional-man-headshot-2.png",
    quote: "Smart scheduling helps us fit 30% more appointments per day while reducing travel time between jobs.",
    rating: 5,
  },
  {
    name: "Lisa Martinez",
    company: "Martinez Cleaning Services",
    image: "/professional-woman-headshot-2.png",
    quote: "Team coordination features ensure we never double-book and our customers always know when we're coming.",
    rating: 5,
  },
]

export default function SchedulingFeaturesPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#F67721]/20 to-[#F5F906]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5F906]/20 to-[#92E138]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#F67721]/10 to-[#F5F906]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30 text-lg px-4 py-2">
              Task Scheduling
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Never Miss Another{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Appointment
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Streamline your scheduling with AI-powered appointment booking, automated reminders, and team coordination
              tools that keep your business running smoothly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-[#F67721] hover:bg-[#F67721]/10 bg-transparent"
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
                <div className="w-16 h-16 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Complete Scheduling Solution</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage appointments and keep your schedule optimized
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {schedulingFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#92E138]" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
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
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">See how businesses are optimizing their schedules</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-[#92E138]/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#F5F906] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#08042B] via-[#0A0B2E] to-[#1A0B3D]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Optimize Your Schedule?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start reducing no-shows and maximizing your team's efficiency with smart scheduling tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-[#F67721] hover:bg-[#F67721]/10 bg-transparent"
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
