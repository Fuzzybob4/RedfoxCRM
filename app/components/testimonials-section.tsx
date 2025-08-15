"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Owner, Bright Lights Holiday Services",
    company: "Holiday Lighting Business",
    image: "/professional-woman-headshot.png",
    rating: 5,
    text: "RedFox CRM transformed our holiday lighting business. We can now manage 200+ installations seamlessly, track our crews in real-time, and our customer satisfaction has never been higher. The seasonal scheduling features are a game-changer!",
  },
  {
    name: "Mike Rodriguez",
    role: "Operations Manager",
    company: "GreenScape Landscaping",
    image: "/professional-man-headshot.png",
    rating: 5,
    text: "The route optimization and recurring service features have saved us hours every week. Our team loves the mobile app, and our customers appreciate the professional communication tools. ROI was evident within the first month.",
  },
  {
    name: "Emily Chen",
    role: "CEO",
    company: "Urban Garden Solutions",
    image: "/professional-woman-headshot-2.png",
    rating: 5,
    text: "As we scaled from 50 to 500+ clients, RedFox CRM grew with us. The automation tools handle our follow-ups, the reporting gives us insights we never had before, and the customer portal has reduced our admin work by 60%.",
  },
  {
    name: "David Thompson",
    role: "Founder",
    company: "Elite Property Services",
    image: "/professional-man-headshot-2.png",
    rating: 5,
    text: "The integration capabilities are outstanding. We connected our accounting software, scheduling tools, and payment processing. Everything works together seamlessly, and our team productivity has increased by 40%.",
  },
]

const stats = [
  { value: "98%", label: "Customer Satisfaction" },
  { value: "45%", label: "Average Revenue Increase" },
  { value: "60%", label: "Time Saved on Admin" },
  { value: "10K+", label: "Happy Customers" },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#08042B] to-[#1a0f4a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Testimonials</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Trusted by Thousands of
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Growing Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how businesses like yours are using RedFox CRM to streamline operations, increase revenue, and deliver
            exceptional customer experiences.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm lg:text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-400/30" />
                  <p className="text-gray-300 leading-relaxed pl-6">"{testimonial.text}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Join thousands of satisfied customers who trust RedFox CRM</p>
          <div className="flex justify-center items-center space-x-2 text-yellow-400">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="text-white font-semibold">4.9/5</span>
            <span className="text-gray-400">from 2,500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
