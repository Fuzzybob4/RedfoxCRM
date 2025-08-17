import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Bright Lights Holiday Services",
    image: "/professional-woman-headshot.png",
    rating: 5,
    text: "RedFox CRM transformed our holiday lighting business. We increased our customer base by 150% and reduced scheduling conflicts by 90%. The seasonal workflow management is incredible.",
  },
  {
    name: "Mike Rodriguez",
    company: "Elite Outdoor Lighting",
    image: "/professional-man-headshot.png",
    rating: 5,
    text: "The route optimization feature alone saved us 3 hours per day. Our crews are more efficient, customers are happier, and our profit margins have improved significantly.",
  },
  {
    name: "Jennifer Chen",
    company: "GreenScape Landscaping",
    image: "/professional-woman-headshot-2.png",
    rating: 5,
    text: "Managing 200+ recurring lawn care customers was a nightmare before RedFox. Now everything is automated - scheduling, invoicing, and customer communication. It's been a game-changer.",
  },
  {
    name: "David Thompson",
    company: "AquaTech Irrigation",
    image: "/professional-man-headshot-2.png",
    rating: 5,
    text: "The system diagnostics and maintenance tracking features help us prevent issues before they happen. Our customer retention rate increased to 95% since implementing RedFox CRM.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0B2E] to-[#08042B]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            See how home services businesses are growing faster and serving customers better with RedFox CRM.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#F5F906] fill-current" />
                  ))}
                </div>
                <blockquote className="text-white/90 text-lg mb-6 leading-relaxed">"{testimonial.text}"</blockquote>
                <div className="flex items-center">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/70 text-sm">{testimonial.company}</div>
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
