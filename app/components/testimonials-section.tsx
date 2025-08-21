import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Bright Lights Holiday Services",
    image: "/image/home/professional-woman-headshot.png",
    rating: 5,
    text: "RedFox CRM transformed our holiday lighting business. We increased our customer retention by 40% and streamlined our entire operation.",
  },
  {
    name: "Mike Rodriguez",
    company: "Elite Outdoor Lighting",
    image: "/image/home/professional-man-headshot.png",
    rating: 5,
    text: "The scheduling and customer management features are incredible. We've cut our administrative time in half and our customers love the communication tools.",
  },
  {
    name: "Jennifer Chen",
    company: "GreenScape Landscaping",
    image: "/image/home/professional-woman-headshot-2.png",
    rating: 5,
    text: "Finally, a CRM built for home services! The route optimization and customer tracking features have been game-changers for our landscaping business.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Home Service Professionals</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how businesses like yours are growing with RedFox CRM
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/image/avatar/default.png"
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
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
