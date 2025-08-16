import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, FileText, Wrench, Shield, Users, MapPin, DollarSign, Star, ArrowRight } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Design Proposals & Quotes",
    description: "Create professional lighting design proposals with 3D renderings and detailed quotes.",
  },
  {
    icon: MapPin,
    title: "Installation Project Management",
    description: "Track installation progress, manage crews, and coordinate with electrical permits.",
  },
  {
    icon: Wrench,
    title: "Maintenance Scheduling",
    description: "Automated maintenance reminders, bulb replacements, and system diagnostics.",
  },
  {
    icon: Shield,
    title: "Warranty Management",
    description: "Track warranties on fixtures, bulbs, and installations with automated alerts.",
  },
  {
    icon: Users,
    title: "Customer Portal",
    description: "Give customers access to their lighting system status, maintenance history, and service requests.",
  },
  {
    icon: DollarSign,
    title: "Service Contracts",
    description: "Manage ongoing maintenance contracts and recurring revenue streams.",
  },
]

const benefits = [
  {
    stat: "35%",
    label: "More Projects",
    description: "Better proposal management and follow-up",
  },
  {
    stat: "50%",
    label: "Faster Installations",
    description: "Streamlined project coordination",
  },
  {
    stat: "30%",
    label: "Higher Margins",
    description: "Efficient maintenance and upselling",
  },
]

const testimonials = [
  {
    name: "David Rodriguez",
    company: "Illumination Experts",
    quote:
      "RedFox CRM helped us scale from 50 to 200 outdoor lighting projects per year. The proposal system is incredible.",
    rating: 5,
  },
  {
    name: "Jennifer Walsh",
    company: "Landscape Lighting Solutions",
    quote: "The maintenance scheduling feature keeps our customers happy and our recurring revenue steady.",
    rating: 5,
  },
]

export default function OutdoorLightingPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Outdoor Lighting CRM
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Illuminate Your{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Outdoor Lighting
              </span>{" "}
              Business
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From design proposals to ongoing maintenance, RedFox CRM provides outdoor lighting professionals with the
              tools to create stunning landscapes and build lasting customer relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white"
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Outdoor Lighting Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to design, install, and maintain beautiful outdoor lighting systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-yellow-500/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Proven Results for Lighting Professionals
            </h2>
            <p className="text-xl text-gray-300">See how RedFox CRM transforms outdoor lighting businesses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Lighting Professionals Say</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Project Lifecycle Management</h2>
            <p className="text-xl text-gray-300">From initial consultation to ongoing maintenance.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { step: "1", title: "Consultation", desc: "Site assessment and customer needs" },
                { step: "2", title: "Design", desc: "3D proposals and lighting plans" },
                { step: "3", title: "Installation", desc: "Project management and crew coordination" },
                { step: "4", title: "Testing", desc: "System commissioning and customer walkthrough" },
                { step: "5", title: "Maintenance", desc: "Ongoing service and warranty support" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Brighten Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the outdoor lighting professionals who trust RedFox CRM to manage their projects and grow their
              business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white"
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
