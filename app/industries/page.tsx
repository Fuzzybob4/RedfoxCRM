import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  TreePine,
  Droplets,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const industries = [
  {
    icon: Sparkles,
    title: "Holiday Lighting",
    description:
      "Manage seasonal installations, customer contracts, and equipment tracking for holiday lighting businesses.",
    features: ["Installation scheduling", "Seasonal contracts", "Equipment inventory", "Take-down reminders"],
    href: "/industries/holiday-lighting",
    color: "from-red-500 to-green-500",
    popular: true,
  },
  {
    icon: Lightbulb,
    title: "Outdoor Lighting",
    description: "Year-round landscape lighting design, installation, and maintenance service management.",
    features: ["Design proposals", "Installation tracking", "Maintenance schedules", "Warranty management"],
    href: "/industries/outdoor-lighting",
    color: "from-yellow-500 to-orange-500",
    popular: true,
  },
  {
    icon: TreePine,
    title: "Landscaping & Lawn Care",
    description: "Complete lawn care and landscaping service management with seasonal scheduling.",
    features: ["Route optimization", "Seasonal services", "Equipment tracking", "Recurring billing"],
    href: "/industries/landscaping",
    color: "from-green-500 to-emerald-600",
    popular: false,
  },
  {
    icon: Droplets,
    title: "Irrigation & Sprinklers",
    description: "Sprinkler system installation, maintenance, and seasonal service management.",
    features: ["System diagnostics", "Seasonal activation", "Repair tracking", "Water usage reports"],
    href: "/industries/irrigation",
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
]

const stats = [
  { label: "Lighting Contractors", value: "2,500+", icon: Lightbulb },
  { label: "Customer Satisfaction", value: "4.9/5", icon: Star },
  { label: "Revenue Growth", value: "+52%", icon: TrendingUp },
  { label: "Jobs Scheduled", value: "150K+", icon: Calendar },
]

const testimonials = [
  {
    name: "Mike Rodriguez",
    company: "Bright Nights Holiday Lighting",
    industry: "Holiday Lighting",
    image: "/professional-man-headshot.png",
    quote:
      "RedFox CRM helped us manage 400+ holiday lighting installations this season. The scheduling and customer tracking features are game-changers.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    company: "Illuminate Outdoor Lighting",
    industry: "Outdoor Lighting",
    image: "/professional-woman-headshot.png",
    quote: "From design proposals to maintenance schedules, RedFox keeps our lighting business organized year-round.",
    rating: 5,
  },
  {
    name: "Tom Wilson",
    company: "Wilson Lawn & Landscape",
    industry: "Landscaping",
    image: "/professional-man-headshot-2.png",
    quote: "Route optimization and seasonal scheduling increased our efficiency by 40%. Our crews love the mobile app.",
    rating: 5,
  },
]

const seasonalFeatures = [
  {
    season: "Fall/Winter",
    title: "Holiday Lighting Season",
    features: [
      "Installation scheduling & crew management",
      "Customer contract tracking",
      "Equipment inventory management",
      "Take-down scheduling & reminders",
      "Seasonal billing & payments",
    ],
    color: "from-red-500 to-green-500",
  },
  {
    season: "Spring/Summer",
    title: "Outdoor Services Season",
    features: [
      "Landscape lighting installations",
      "Irrigation system maintenance",
      "Lawn care route optimization",
      "Recurring service scheduling",
      "Equipment maintenance tracking",
    ],
    color: "from-green-500 to-blue-500",
  },
]

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#F67721]/20 to-[#F5F906]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5F906]/20 to-[#92E138]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#F67721]/10 to-[#F5F906]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30 text-lg px-4 py-2">
              Home Services CRM
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Lighting & Landscape
              </span>{" "}
              Professionals
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Specialized CRM for holiday lighting, outdoor lighting, landscaping, and seasonal home service businesses.
              Manage installations, track equipment, and grow your business year-round.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-[#F67721] hover:bg-[#F67721]/10 bg-transparent"
                asChild
              >
                <Link href="/contact-sales">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Specialized for Your Business</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your specialty to see how RedFox CRM can streamline your operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {industries.map((industry, index) => (
              <Card
                key={index}
                className={`bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group cursor-pointer relative ${
                  industry.popular ? "ring-2 ring-[#F67721]/50" : ""
                }`}
              >
                {industry.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#F67721] text-white">Most Popular</Badge>
                  </div>
                )}
                <Link href={industry.href}>
                  <CardHeader className="text-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${industry.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <industry.icon className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white group-hover:text-[#F5F906] transition-colors">
                      {industry.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300 leading-relaxed">{industry.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {industry.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-[#92E138] flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-[#F67721] group-hover:text-[#F5F906] transition-colors">
                      <span className="font-medium">Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Features */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Year-Round Business Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              RedFox CRM adapts to your seasonal business needs with specialized features for every time of year
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {seasonalFeatures.map((season, index) => (
              <Card key={index} className="bg-white/5 border-[#92E138]/20">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${season.color} rounded-full flex items-center justify-center`}
                    >
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30">{season.season}</Badge>
                      <CardTitle className="text-xl text-white">{season.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {season.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-[#92E138] flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how lighting and landscape professionals are growing their businesses with RedFox CRM
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-[#92E138]/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#F5F906] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.company}</div>
                      <div className="text-xs text-[#F67721]">{testimonial.industry}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#08042B] via-[#0A0B2E] to-[#1A0B3D]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Light Up Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of lighting and landscape professionals using RedFox CRM to streamline operations and grow
              their seasonal businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-[#F67721] hover:bg-[#F67721]/10 bg-transparent"
                asChild
              >
                <Link href="/contact-sales">Contact Sales</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  )
}
