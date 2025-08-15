import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BarChart3,
  MessageSquare,
  Calendar,
  FileText,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Organize and track all your customer interactions in one centralized location.",
    benefits: ["Contact organization", "Interaction history", "Custom fields", "Segmentation"],
    color: "text-blue-500",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Get detailed insights into your sales performance with advanced reporting tools.",
    benefits: ["Revenue tracking", "Performance metrics", "Custom reports", "Data visualization"],
    color: "text-green-500",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Streamline all customer communications across email, phone, and social media.",
    benefits: ["Email integration", "Call logging", "Social media sync", "Message templates"],
    color: "text-purple-500",
  },
  {
    icon: Calendar,
    title: "Task Scheduling",
    description: "Never miss a follow-up with automated task scheduling and reminders.",
    benefits: ["Automated reminders", "Task assignment", "Calendar sync", "Priority management"],
    color: "text-orange-500",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Store and organize all your business documents with easy search and access.",
    benefits: ["File storage", "Document sharing", "Version control", "Search functionality"],
    color: "text-red-500",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Enterprise-grade security to keep your customer data safe and compliant.",
    benefits: ["Data encryption", "Access controls", "Compliance tools", "Backup systems"],
    color: "text-indigo-500",
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Automate repetitive tasks and workflows to boost your team's productivity.",
    benefits: ["Workflow automation", "Email sequences", "Task automation", "Custom triggers"],
    color: "text-yellow-500",
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    description: "Access your CRM from anywhere with our web, mobile, and desktop applications.",
    benefits: ["Web application", "Mobile apps", "Desktop client", "Offline access"],
    color: "text-teal-500",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30">
              Comprehensive CRM Solution
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Grow Your Business
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              RedFox CRM provides all the tools you need to manage customers, track sales, and scale your business
              efficiently. Discover how our comprehensive features can transform your workflow.
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

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-white/10 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
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

      {/* Industry Solutions */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Built for Every Industry</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our CRM adapts to your specific business needs with industry-tailored solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white/5 rounded-lg border border-[#92E138]/20">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Real Estate</h3>
              <p className="text-gray-300 mb-6">
                Manage properties, leads, and client relationships with specialized tools for real estate professionals.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Property management</li>
                <li>• Lead tracking</li>
                <li>• Commission tracking</li>
                <li>• Document storage</li>
              </ul>
            </div>

            <div className="text-center p-8 bg-white/5 rounded-lg border border-[#92E138]/20">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Sales Teams</h3>
              <p className="text-gray-300 mb-6">
                Track leads, manage pipelines, and close more deals with powerful sales-focused features.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Pipeline management</li>
                <li>• Lead scoring</li>
                <li>• Sales forecasting</li>
                <li>• Team collaboration</li>
              </ul>
            </div>

            <div className="text-center p-8 bg-white/5 rounded-lg border border-[#92E138]/20">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F67721] to-[#F5F906] rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Service Business</h3>
              <p className="text-gray-300 mb-6">
                Schedule appointments, track service history, and manage customer support efficiently.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Appointment scheduling</li>
                <li>• Service history</li>
                <li>• Customer support</li>
                <li>• Billing integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Experience These Features?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your free 14-day trial today and see how RedFox CRM can transform your business operations.
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
          </div>
        </div>
      </section>
    </div>
  )
}
