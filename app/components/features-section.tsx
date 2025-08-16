"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BarChart3, MessageSquare, Calendar, FileText, Shield, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Organize and track all your customer interactions in one centralized location.",
    benefits: ["Contact organization", "Interaction history", "Custom fields", "Segmentation"],
    color: "text-blue-500",
    href: "/features/customers",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Get detailed insights into your sales performance with advanced reporting tools.",
    benefits: ["Revenue tracking", "Performance metrics", "Custom reports", "Data visualization"],
    color: "text-green-500",
    href: "/features/analytics",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Streamline all customer communications across email, phone, and social media.",
    benefits: ["Email integration", "Call logging", "Social media sync", "Message templates"],
    color: "text-purple-500",
    href: "/features/communication",
  },
  {
    icon: Calendar,
    title: "Task Scheduling",
    description: "Never miss a follow-up with automated task scheduling and reminders.",
    benefits: ["Automated reminders", "Task assignment", "Calendar sync", "Priority management"],
    color: "text-orange-500",
    href: "/features/scheduling",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Store and organize all your business documents with easy search and access.",
    benefits: ["File storage", "Document sharing", "Version control", "Search functionality"],
    color: "text-red-500",
    href: "/features/documents",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Enterprise-grade security to keep your customer data safe and compliant.",
    benefits: ["Data encryption", "Access controls", "Compliance tools", "Backup systems"],
    color: "text-indigo-500",
    href: "/features/security",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#08042B] to-[#0A0B2E]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30">Powerful Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
              Grow Your Business
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            RedFox CRM provides comprehensive tools to manage customers, track sales, and scale your business
            efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
            >
              <Link href={feature.href}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg bg-white/10 ${feature.color} group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white group-hover:text-[#F5F906] transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#92E138]" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-[#F67721] group-hover:text-[#F5F906] transition-colors">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white"
            asChild
          >
            <Link href="/features">
              View All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
