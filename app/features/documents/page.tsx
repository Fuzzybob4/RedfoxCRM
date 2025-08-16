import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Upload,
  Search,
  Share2,
  Lock,
  Archive,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const documentFeatures = [
  {
    icon: FileText,
    title: "Document Storage",
    description: "Securely store all your business documents with unlimited cloud storage and easy organization.",
    benefits: ["Unlimited storage", "Cloud backup", "File organization", "Version control"],
  },
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag and drop files or bulk upload documents with automatic categorization and tagging.",
    benefits: ["Drag & drop", "Bulk upload", "Auto-categorization", "Smart tagging"],
  },
  {
    icon: Search,
    title: "Powerful Search",
    description: "Find any document instantly with full-text search, filters, and AI-powered content recognition.",
    benefits: ["Full-text search", "Smart filters", "AI recognition", "Quick access"],
  },
  {
    icon: Share2,
    title: "Secure Sharing",
    description: "Share documents with team members and clients with customizable permissions and access controls.",
    benefits: ["Team sharing", "Client portals", "Permission controls", "Access tracking"],
  },
  {
    icon: Lock,
    title: "Data Security",
    description: "Enterprise-grade encryption and security measures to keep your sensitive documents protected.",
    benefits: ["End-to-end encryption", "Access logs", "Compliance ready", "Secure backup"],
  },
  {
    icon: Archive,
    title: "Smart Organization",
    description: "Automatically organize documents by customer, project, or custom categories with smart folders.",
    benefits: ["Auto-organization", "Custom categories", "Smart folders", "Bulk operations"],
  },
]

const stats = [
  { label: "Search Speed", value: "< 1sec", icon: Zap },
  { label: "Uptime", value: "99.9%", icon: Shield },
  { label: "File Recovery", value: "100%", icon: Archive },
  { label: "User Rating", value: "4.8/5", icon: Star },
]

const testimonials = [
  {
    name: "John Davis",
    company: "Davis Construction",
    image: "/professional-man-headshot.png",
    quote: "Document management transformed our project workflow. We can find any contract or blueprint in seconds.",
    rating: 5,
  },
  {
    name: "Rachel Green",
    company: "Green Accounting",
    image: "/professional-woman-headshot-2.png",
    quote: "Secure client portals make document sharing effortless. Our clients love the convenience and security.",
    rating: 5,
  },
  {
    name: "Tom Wilson",
    company: "Wilson Legal Services",
    image: "/professional-man-headshot-2.png",
    quote:
      "Version control and audit trails are essential for our legal practice. RedFox delivers exactly what we need.",
    rating: 5,
  },
]

export default function DocumentsFeaturesPage() {
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
              Document Management
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Organize All Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Business Documents
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Store, organize, and share all your business documents securely in the cloud. Find any file instantly with
              powerful search and smart organization.
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

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Complete Document Solution</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your business documents efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {documentFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#92E138]" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
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
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Customer Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how businesses are streamlining their document management
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Organize Your Documents?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start managing all your business documents in one secure, searchable location today.
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
