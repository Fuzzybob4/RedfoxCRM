import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Key, Eye, FileCheck, Server, CheckCircle, ArrowRight, Star, Target, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const securityFeatures = [
  {
    icon: Shield,
    title: "Enterprise Encryption",
    description: "Military-grade AES-256 encryption protects your data both in transit and at rest.",
    benefits: ["AES-256 encryption", "End-to-end security", "Encrypted backups", "Secure transmission"],
  },
  {
    icon: Lock,
    title: "Access Controls",
    description: "Granular permission system with role-based access controls and multi-factor authentication.",
    benefits: ["Role-based access", "Multi-factor auth", "Permission levels", "Access logging"],
  },
  {
    icon: Key,
    title: "Single Sign-On",
    description: "Integrate with your existing identity providers for seamless and secure authentication.",
    benefits: ["SSO integration", "SAML support", "Active Directory", "OAuth providers"],
  },
  {
    icon: Eye,
    title: "Audit Trails",
    description: "Complete audit logs track every action and change for compliance and security monitoring.",
    benefits: ["Complete logging", "User activity", "Change tracking", "Compliance reports"],
  },
  {
    icon: FileCheck,
    title: "Compliance Ready",
    description: "Built-in compliance features for GDPR, HIPAA, SOC 2, and other industry standards.",
    benefits: ["GDPR compliance", "HIPAA ready", "SOC 2 certified", "Industry standards"],
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Cloud infrastructure with 99.9% uptime, automated backups, and disaster recovery.",
    benefits: ["99.9% uptime", "Auto backups", "Disaster recovery", "Redundant systems"],
  },
]

const stats = [
  { label: "Uptime", value: "99.9%", icon: Target },
  { label: "Security Score", value: "A+", icon: Shield },
  { label: "Backup Frequency", value: "Real-time", icon: Clock },
  { label: "Compliance", value: "100%", icon: FileCheck },
]

const testimonials = [
  {
    name: "Dr. Michael Brown",
    company: "Brown Medical Group",
    image: "/professional-man-headshot.png",
    quote: "HIPAA compliance and security features give us complete confidence in protecting patient data.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    company: "Johnson Financial",
    image: "/professional-woman-headshot.png",
    quote: "Enterprise-grade security without the enterprise complexity. Perfect for our growing firm.",
    rating: 5,
  },
  {
    name: "Alex Chen",
    company: "Chen Tech Solutions",
    image: "/professional-man-headshot-2.png",
    quote: "Audit trails and access controls help us maintain SOC 2 compliance effortlessly.",
    rating: 5,
  },
]

export default function SecurityFeaturesPage() {
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
              Data Security
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Enterprise-Grade{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Security & Compliance
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Protect your business data with military-grade encryption, comprehensive access controls, and built-in
              compliance features that meet the highest industry standards.
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Comprehensive Security Suite</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every security feature you need to protect your business and maintain compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {securityFeatures.map((feature, index) => (
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Trusted by Professionals</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how businesses trust RedFox CRM with their most sensitive data
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready for Enterprise Security?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Protect your business with the same security standards used by Fortune 500 companies.
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
