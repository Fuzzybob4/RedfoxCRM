"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Owner, Green Thumb Landscaping",
    image: "/professional-woman-headshot.png",
    rating: 5,
    content:
      "RedFox CRM transformed our business operations. We've increased our customer retention by 40% and our team is more organized than ever. The scheduling features alone have saved us 10 hours per week.",
    stats: {
      label: "Customer Retention",
      value: "+40%",
    },
  },
  {
    name: "Mike Rodriguez",
    title: "CEO, Holiday Lights Pro",
    image: "/professional-man-headshot.png",
    rating: 5,
    content:
      "The seasonal business features are incredible. RedFox CRM helps us manage our holiday lighting installations and takedowns seamlessly. Our revenue has grown 60% since implementing the system.",
    stats: {
      label: "Revenue Growth",
      value: "+60%",
    },
  },
  {
    name: "Jennifer Chen",
    title: "Operations Manager, Elite Property Services",
    image: "/professional-woman-headshot-2.png",
    rating: 5,
    content:
      "Managing multiple properties used to be a nightmare. Now with RedFox CRM, we can track all maintenance requests, coordinate our teams, and keep tenants happy. It's been a game-changer for our efficiency.",
    stats: {
      label: "Efficiency Gain",
      value: "+75%",
    },
  },
  {
    name: "David Thompson",
    title: "Founder, Thompson Home Services",
    image: "/professional-man-headshot-2.png",
    rating: 5,
    content:
      "The automation features have revolutionized how we handle customer communications. Follow-ups are automatic, scheduling is seamless, and our customer satisfaction scores have never been higher.",
    stats: {
      label: "Customer Satisfaction",
      value: "+85%",
    },
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Service Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how RedFox CRM is helping service businesses across the country grow faster and operate more
            efficiently.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gray-50">
              <CardContent className="p-8">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-[#F67721] mb-4" />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>

                {/* Stats */}
                <div className="bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{testimonial.stats.value}</div>
                    <div className="text-white/90 text-sm">{testimonial.stats.label}</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-[#F67721] mb-2">10,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#F67721] mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#F67721] mb-2">4.9/5</div>
            <div className="text-gray-600">Customer Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#F67721] mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
