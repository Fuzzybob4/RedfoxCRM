import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, PieChart, LineChart, Target, DollarSign, Users, CheckCircle, ArrowRight, Star } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"

const analyticsFeatures = [
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description: "Track revenue trends, forecast growth, and identify your most profitable customers and services.",
    benefits: ["Revenue tracking", "Growth forecasting", "Profit analysis", "Customer value metrics"],
  },
  {
    icon: TrendingUp,
    title: "Sales Performance",
    description: "Monitor sales team performance, conversion rates, and pipeline health in real-time.",
    benefits: ["Team performance", "Conversion tracking", "Pipeline analysis", "Goal monitoring"],
  },
  {
    icon: PieChart,
    title: "Customer Insights",
    description: "Understand customer behavior, preferences, and lifetime value with detailed analytics.",
    benefits: ["Behavior analysis", "Segmentation", "Lifetime value", "Churn prediction"],
  },
  {
    icon: LineChart,
    title: "Trend Analysis",
    description: "Identify patterns and trends in your business data to make informed strategic decisions.",
    benefits: ["Pattern recognition", "Seasonal trends", "Market analysis", "Predictive insights"],
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set and monitor business goals with automated progress tracking and performance alerts.",
    benefits: ["Goal setting", "Progress tracking", "Performance alerts", "Achievement metrics"],
  },
  {
    icon: DollarSign,
    title: "Financial Reports",
    description: "Generate comprehensive financial reports with customizable metrics and export options.",
    benefits: ["Financial reporting", "Custom metrics", "Export options", "Automated reports"],
  },
]

const stats = [
  { label: "Revenue Growth", value: "+47%", icon: TrendingUp },
  { label: "Data Accuracy", value: "99.9%", icon: Target },
  { label: "Report Generation", value: "< 5sec", icon: BarChart3 },
  { label: "Customer Insights", value: "360°", icon: Users },
]

const testimonials = [
  {
    name: "David Park",
    company: "Park Construction",
    image: "/professional-man-headshot-2.png",
    quote:
      "The analytics dashboard helped us identify our most profitable services and increase revenue by 47% in just 6 months.",
    rating: 5,
  },
  {
    name: "Jennifer Smith",
    company: "Smith Marketing Agency",
    image: "/professional-woman-headshot.png",
    quote:
      "Real-time sales performance tracking transformed how we manage our team. Everyone knows exactly where they stand.",
    rating: 5,
  },
  {
    name: "Carlos Rodriguez",
    company: "Rodriguez HVAC",
    image: "/professional-man-headshot.png",
    quote: "Customer insights helped us reduce churn by 35% and increase customer lifetime value significantly.",
    rating: 5,
  },
]

export default function AnalyticsFeaturesPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      <Header />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#F67721]/20 to-[#F5F906]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5F906]/20 to-[#92E138]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#F67721]/10 to-[#F5F906]/10 rounded-full blur-3xl"></div>
      </div>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30 text-lg px-4 py-2">
                Sales Analytics
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Make Data-Driven{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                  Business Decisions
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform raw data into actionable insights with powerful analytics tools that help you understand your
                business, track performance, and predict future growth.
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
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Powerful Analytics Tools</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get deep insights into every aspect of your business performance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {analyticsFeatures.map((feature, index) => (
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
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Success Stories</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how businesses are using analytics to drive growth
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
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Unlock Your Business Insights?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Start making data-driven decisions today with powerful analytics that grow with your business.
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
      </main>

      <Footer />
    </div>
  )
}
