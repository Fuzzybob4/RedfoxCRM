import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  FileText,
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const customerFeatures = [
  {
    icon: Users,
    title: "360° Customer Profiles",
    description: "Complete customer view with contact details, interaction history, preferences, and custom fields.",
    benefits: ["Contact management", "Interaction timeline", "Custom fields", "Customer segmentation"],
  },
  {
    icon: MessageSquare,
    title: "Smart Communication Hub",
    description: "Track all customer communications across email, phone, SMS, and social media in one place.",
    benefits: ["Multi-channel tracking", "Message templates", "Auto-responses", "Communication history"],
  },
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Automated booking system with calendar sync, reminders, and customer self-scheduling.",
    benefits: ["Online booking", "Calendar integration", "Automated reminders", "Reschedule management"],
  },
  {
    icon: BarChart3,
    title: "Customer Analytics",
    description: "Deep insights into customer behavior, lifetime value, and engagement patterns.",
    benefits: ["Lifetime value tracking", "Behavior analysis", "Engagement metrics", "Custom reports"],
  },
  {
    icon: Target,
    title: "Lead Management",
    description: "Automated lead scoring, nurturing campaigns, and conversion tracking.",
    benefits: ["Lead scoring", "Nurture campaigns", "Conversion tracking", "Pipeline management"],
  },
  {
    icon: FileText,
    title: "Service Documentation",
    description: "Photo documentation, work history, and service notes for every customer interaction.",
    benefits: ["Photo documentation", "Service history", "Work notes", "Before/after photos"],
  },
]

const stats = [
  { label: "Customer Retention", value: "94%", icon: TrendingUp },
  { label: "Response Time", value: "2min", icon: Clock },
  { label: "Satisfaction Score", value: "4.8/5", icon: Star },
  { label: "Lead Conversion", value: "68%", icon: Target },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Johnson Landscaping",
    image: "/professional-woman-headshot.png",
    quote:
      "RedFox CRM transformed how we manage our 500+ customers. The 360° profiles help us provide personalized service every time.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    company: "Chen's Auto Repair",
    image: "/professional-man-headshot.png",
    quote:
      "The service documentation feature is incredible. We can show customers exactly what work was done with photos and detailed notes.",
    rating: 5,
  },
  {
    name: "Lisa Rodriguez",
    company: "Rodriguez Real Estate",
    image: "/professional-woman-headshot-2.png",
    quote: "Lead management and automated follow-ups increased our conversion rate by 40%. Best investment we've made.",
    rating: 5,
  },
]

export default function CustomerFeaturesPage() {
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
              Customer Management
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Build Stronger{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Customer Relationships
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform every customer interaction with comprehensive profiles, smart communication tools, and powerful
              analytics that help you deliver exceptional service every time.
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Comprehensive Customer Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to understand, engage, and delight your customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {customerFeatures.map((feature, index) => (
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

      {/* How It Works */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started with customer management in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Import Your Contacts</h3>
              <p className="text-gray-300">
                Easily import existing customer data from spreadsheets, other CRMs, or add contacts manually with our
                intuitive interface.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Track Interactions</h3>
              <p className="text-gray-300">
                Log every customer interaction automatically or manually. Emails, calls, meetings, and service visits
                are all tracked in one place.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Deliver Better Service</h3>
              <p className="text-gray-300">
                Use customer insights and history to provide personalized service, anticipate needs, and build stronger
                relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how businesses like yours are transforming their customer relationships
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Customer Management?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses using RedFox CRM to build stronger customer relationships and grow their
              revenue.
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
