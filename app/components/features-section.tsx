"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BarChart3, Calendar, MessageSquare, Shield, Zap, Target, TrendingUp, Clock } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Organize and track all your customer interactions in one centralized location.",
    badge: "Core Feature",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Get detailed insights into your sales performance with advanced reporting tools.",
    badge: "Analytics",
  },
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Streamline your booking process with integrated calendar management.",
    badge: "Productivity",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Keep all customer communications organized with built-in messaging tools.",
    badge: "Communication",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Enterprise-grade security to protect your sensitive business information.",
    badge: "Security",
  },
  {
    icon: Zap,
    title: "Automation Tools",
    description: "Automate repetitive tasks and workflows to save time and increase efficiency.",
    badge: "Automation",
  },
  {
    icon: Target,
    title: "Lead Management",
    description: "Track and nurture leads through your entire sales pipeline.",
    badge: "Sales",
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Monitor key metrics and KPIs to optimize your business performance.",
    badge: "Analytics",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on projects and tasks for accurate billing and productivity.",
    badge: "Productivity",
  },
]

const industryFeatures = [
  {
    title: "Holiday Lighting Services",
    description: "Specialized tools for seasonal lighting businesses",
    features: [
      "Seasonal project scheduling",
      "Installation crew management",
      "Equipment inventory tracking",
      "Weather-based scheduling",
    ],
  },
  {
    title: "Landscaping & Lawn Care",
    description: "Complete solution for landscaping professionals",
    features: [
      "Route optimization",
      "Recurring service scheduling",
      "Equipment maintenance logs",
      "Before/after photo documentation",
    ],
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#08042B] to-[#1a0f4a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">Features</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Grow Your Business
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our comprehensive CRM platform provides all the tools you need to manage customers, track sales, and scale
            your operations efficiently.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry-Specific Features */}
        <div className="space-y-12">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">Industry Solutions</Badge>
            <h3 className="text-3xl font-bold mb-4 text-white">Tailored for Your Industry</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Specialized features designed for specific business types to maximize efficiency and results.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {industryFeatures.map((industry, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/20 hover:border-white/30 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <h4 className="text-2xl font-bold text-white mb-3">{industry.title}</h4>
                  <p className="text-gray-300 mb-6">{industry.description}</p>
                  <ul className="space-y-3">
                    {industry.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
