"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, GreenScape Solutions",
    content:
      "RedFox CRM has transformed how we manage our landscaping business. The customer tracking and project management features are exactly what we needed.",
    rating: 5,
    avatar: "SJ",
    image: "/professional-woman-headshot.png",
  },
  {
    name: "Mike Chen",
    role: "Owner, Bright Lights Co.",
    content:
      "The scheduling and invoicing features have saved us countless hours. Our holiday lighting business has never been more organized.",
    rating: 5,
    avatar: "MC",
    image: "/professional-man-headshot.png",
  },
  {
    name: "Emily Rodriguez",
    role: "Operations Manager, AquaFlow Systems",
    content:
      "Customer communication has improved dramatically since switching to RedFox CRM. Our irrigation clients love the automated updates.",
    rating: 5,
    avatar: "ER",
    image: "/professional-woman-headshot-2.png",
  },
  {
    name: "David Thompson",
    role: "Founder, Elite Outdoor Lighting",
    content:
      "The analytics dashboard gives us insights we never had before. We've increased our revenue by 40% in just six months.",
    rating: 5,
    avatar: "DT",
    image: "/professional-man-headshot-2.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how businesses like yours are transforming their operations with RedFox CRM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning fill-current" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                    <AvatarFallback className="bg-brand-orange text-white font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
