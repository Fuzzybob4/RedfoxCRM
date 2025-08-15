"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, BarChart3, MessageSquare, Zap, Leaf, Home, Building, Wrench } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Centralize all customer information, communication history, and service records in one place.",
    badge: "Core Feature",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Optimize routes, manage crew schedules, and send automated reminders to customers.",
    badge: "Popular",
  },
  {
    icon: DollarSign,
    title: "Invoicing & Payments",
    description: "Create professional invoices, track payments, and integrate with popular payment processors.",
    badge: "Essential",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Get insights into revenue, customer retention, and operational efficiency with detailed reports.",
    badge: "Pro Feature",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Send SMS, emails, and push notifications. Keep customers informed every step of the way.",
    badge: "Popular",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks, follow-ups, and service reminders to save time and increase efficiency.",
    badge: "Advanced",
  },
]

const industries = [
  {
    icon: Leaf,
    title: "Landscaping & Lawn Care",
    description: "Manage seasonal services, equipment tracking, and recurring maintenance schedules.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Home,
    title: "Holiday Lighting",
    description: "Track installations, manage seasonal inventory, and schedule takedown services.",
    color: "from-red-500 to-orange-600",
  },
  {
    icon: Building,
    title: "Property Management",
    description: "Coordinate multiple properties, tenant communications, and maintenance requests.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Wrench,
    title: "Home Services",
    description: "Manage service calls, technician schedules, and customer follow-ups efficiently.",
    color: "from-purple-500 to-pink-600",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Grow Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            RedFox CRM provides all the tools you need to manage customers, streamline operations, and scale your
            service business efficiently.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F67721] to-[#F5F906] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry-Specific Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Built for Service Industries</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            RedFox CRM is specifically designed for service-based businesses with industry-specific features and
            workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className={`h-32 bg-gradient-to-br ${industry.color} flex items-center justify-center`}>
                  <industry.icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{industry.title}</h4>
                  <p className="text-gray-600 text-sm">{industry.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
