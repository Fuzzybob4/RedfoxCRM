import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Inbox,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const communicationFeatures = [
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description: "Manage all customer communications from email, SMS, social media, and chat in one centralized inbox.",
    benefits: ["Multi-channel inbox", "Unified conversations", "Smart filtering", "Priority management"],
  },
  {
    icon: Mail,
    title: "Email Integration",
    description:
      "Seamlessly integrate with Gmail, Outlook, and other email providers for automatic conversation tracking.",
    benefits: ["Email sync", "Auto-tracking", "Template library", "Scheduled sending"],
  },
  {
    icon: Phone,
    title: "Call Management",
    description: "Log calls automatically, record conversations, and track call outcomes with integrated telephony.",
    benefits: ["Call logging", "Recording", "Outcome tracking", "Click-to-call"],
  },
  {
    icon: MessageCircle,
    title: "SMS & Messaging",
    description: "Send and receive SMS messages, manage group messaging, and automate follow-up sequences.",
    benefits: ["SMS campaigns", "Group messaging", "Auto-responses", "Message templates"],
  },
  {
    icon: Send,
    title: "Automated Sequences",
    description: "Create automated email and SMS sequences for lead nurturing, follow-ups, and customer onboarding.",
    benefits: ["Drip campaigns", "Trigger-based", "Personalization", "A/B testing"],
  },
  {
    icon: Inbox,
    title: "Team Collaboration",
    description: "Share conversations, assign messages to team members, and collaborate on customer communications.",
    benefits: ["Message assignment", "Team notes", "Collaboration tools", "Shared templates"],
  },
]

const stats = [
  { label: "Response Time", value: "2min", icon: Clock },
  { label: "Message Delivery", value: "99.9%", icon: Send },
  { label: "Customer Satisfaction", value: "4.9/5", icon: Star },
  { label: "Team Efficiency", value: "+65%", icon: Zap },
]

const testimonials = [
  {
    name: "Amanda Wilson",
    company: "Wilson Dental Practice",
    image: "/professional-woman-headshot-2.png",
    quote: "The unified inbox saved us hours every day. We can now respond to patients 3x faster across all channels.",
    rating: 5,
  },
  {
    name: "Robert Kim",
    company: "Kim's Auto Service",
    image: "/professional-man-headshot.png",
    quote: "Automated follow-up sequences increased our customer retention by 40%. The ROI has been incredible.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    company: "Garcia Law Firm",
    image: "/professional-woman-headshot.png",
    quote: "Team collaboration features ensure no client message goes unanswered. Our response rate is now 100%.",
    rating: 5,
  },
]

export default function CommunicationFeaturesPage() {
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
              Communication Hub
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Streamline All Customer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Communications
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Manage every customer conversation across email, phone, SMS, and social media from one unified platform.
              Never miss a message again.
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Complete Communication Suite</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to communicate effectively with your customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {communicationFeatures.map((feature, index) => (
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
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Set up your communication hub in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Connect Your Channels</h3>
              <p className="text-gray-300">
                Integrate your email, phone system, SMS provider, and social media accounts with one-click setup.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Manage from One Place</h3>
              <p className="text-gray-300">
                All customer messages appear in your unified inbox, organized by customer and conversation history.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Automate & Scale</h3>
              <p className="text-gray-300">
                Set up automated responses, follow-up sequences, and team workflows to handle more customers
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Customer Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how businesses are improving their customer communication
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
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Streamline Your Communications?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses using RedFox CRM to manage all customer communications in one place.
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
