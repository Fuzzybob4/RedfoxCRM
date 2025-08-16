import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Users, Clock, MapPin, DollarSign, Star, ArrowRight, Lightbulb } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Seasonal Contract Management",
    description: "Manage installation and take-down contracts with automated scheduling and customer notifications.",
  },
  {
    icon: Package,
    title: "Equipment & Inventory Tracking",
    description: "Track lights, extension cords, timers, and other equipment across multiple job sites.",
  },
  {
    icon: MapPin,
    title: "Installation Route Optimization",
    description: "Optimize crew routes for efficient installations and maximize daily productivity.",
  },
  {
    icon: Clock,
    title: "Take-Down Reminders",
    description: "Automated reminders for seasonal take-downs and equipment retrieval.",
  },
  {
    icon: Users,
    title: "Crew Management",
    description: "Assign crews to installations, track progress, and manage seasonal workforce.",
  },
  {
    icon: DollarSign,
    title: "Seasonal Pricing",
    description: "Dynamic pricing for different seasons, property sizes, and service levels.",
  },
]

const benefits = [
  {
    stat: "40%",
    label: "Faster Installations",
    description: "Optimized routes and crew management",
  },
  {
    stat: "25%",
    label: "More Revenue",
    description: "Better scheduling and upselling",
  },
  {
    stat: "60%",
    label: "Less Admin Time",
    description: "Automated contracts and billing",
  },
]

const testimonials = [
  {
    name: "Mike Johnson",
    company: "Festive Lights Pro",
    quote:
      "RedFox CRM transformed our holiday lighting business. We went from managing 200 homes to over 800 in just two seasons.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    company: "Winter Wonderland Lighting",
    quote: "The equipment tracking feature alone saved us thousands in lost inventory. Game changer for our operation.",
    rating: 5,
  },
]

export default function HolidayLightingPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-gradient-to-r from-red-500 to-green-500 text-white">Holiday Lighting CRM</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Scale Your{" "}
              <span className="bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent">
                Holiday Lighting
              </span>{" "}
              Business
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From seasonal contracts to equipment tracking, RedFox CRM helps holiday lighting professionals manage
              installations, crews, and customers with precision and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-red-500 to-green-500 hover:from-green-500 hover:to-red-500 text-white"
              >
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Link href="/contact-sales">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need for Holiday Lighting Success
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized tools designed specifically for seasonal lighting professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-red-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proven Results for Holiday Lighting Pros</h2>
            <p className="text-xl text-gray-300">See how RedFox CRM transforms seasonal lighting businesses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent mb-2">
                  {benefit.stat}
                </div>
                <div className="text-xl font-semibold text-white mb-2">{benefit.label}</div>
                <div className="text-gray-300">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Holiday Lighting Pros Say</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 mb-4 italic">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Streamlined Holiday Lighting Workflow</h2>
            <p className="text-xl text-gray-300">From quote to take-down, manage your entire seasonal process.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Quote & Contract", desc: "Generate quotes and seasonal contracts" },
                { step: "2", title: "Schedule Installation", desc: "Optimize routes and assign crews" },
                { step: "3", title: "Track Progress", desc: "Monitor installations and equipment" },
                { step: "4", title: "Seasonal Take-Down", desc: "Automated reminders and scheduling" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Lightbulb className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Light Up Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of holiday lighting professionals who trust RedFox CRM to manage their seasonal operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-red-500 to-green-500 hover:from-green-500 hover:to-red-500 text-white"
              >
                <Link href="/signup" className="flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Link href="/contact-sales">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
