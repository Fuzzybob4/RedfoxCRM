import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Download, Users, FileText, CheckCircle, ArrowRight, Clock, Headphones } from "lucide-react"
import Link from "next/link"

const resourceCategories = [
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Comprehensive guides, tutorials, and best practices for getting the most out of RedFox CRM.",
    features: ["Setup guides", "Feature tutorials", "Best practices", "Troubleshooting"],
    href: "/resources/knowledge-base",
    color: "from-blue-500 to-blue-600",
    popular: true,
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides covering every aspect of RedFox CRM functionality.",
    features: ["Getting started videos", "Feature walkthroughs", "Advanced techniques", "Webinar recordings"],
    href: "/resources/videos",
    color: "from-purple-500 to-purple-600",
    popular: false,
  },
  {
    icon: FileText,
    title: "Templates & Tools",
    description: "Ready-to-use templates, checklists, and tools to streamline your business operations.",
    features: ["Contract templates", "Estimate forms", "Checklists", "Workflow templates"],
    href: "/resources/templates",
    color: "from-green-500 to-green-600",
    popular: false,
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other RedFox CRM users, share tips, and get advice from industry experts.",
    features: ["User forums", "Industry groups", "Expert advice", "Success stories"],
    href: "/resources/community",
    color: "from-orange-500 to-orange-600",
    popular: false,
  },
  {
    icon: Headphones,
    title: "Support Center",
    description: "Get help when you need it with our comprehensive support resources and expert team.",
    features: ["Live chat support", "Email support", "Phone support", "Priority support"],
    href: "/resources/support",
    color: "from-red-500 to-red-600",
    popular: false,
  },
  {
    icon: Download,
    title: "Downloads",
    description: "Mobile apps, integrations, and additional tools to extend your RedFox CRM experience.",
    features: ["Mobile apps", "Browser extensions", "API documentation", "Third-party integrations"],
    href: "/resources/downloads",
    color: "from-indigo-500 to-indigo-600",
    popular: false,
  },
]

const featuredResources = [
  {
    title: "Getting Started Guide",
    description: "Complete setup guide for new RedFox CRM users",
    type: "Guide",
    readTime: "15 min read",
    category: "Knowledge Base",
    href: "/resources/knowledge-base/getting-started",
  },
  {
    title: "Holiday Lighting Business Setup",
    description: "Step-by-step video for holiday lighting contractors",
    type: "Video",
    readTime: "12 min watch",
    category: "Video Tutorial",
    href: "/resources/videos/holiday-lighting-setup",
  },
  {
    title: "Service Contract Template",
    description: "Professional service contract template",
    type: "Template",
    readTime: "Download",
    category: "Templates",
    href: "/resources/templates/service-contract",
  },
  {
    title: "Route Optimization Best Practices",
    description: "Maximize efficiency with route optimization tips",
    type: "Guide",
    readTime: "8 min read",
    category: "Knowledge Base",
    href: "/resources/knowledge-base/route-optimization",
  },
]

const stats = [
  { label: "Knowledge Base Articles", value: "200+", icon: BookOpen },
  { label: "Video Tutorials", value: "50+", icon: Video },
  { label: "Templates Available", value: "30+", icon: FileText },
  { label: "Community Members", value: "5,000+", icon: Users },
]

export default function ResourcesPage() {
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
              Resources & Support
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F67721] to-[#F5F906]">
                Succeed
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Comprehensive resources, tutorials, and support to help you get the most out of RedFox CRM and grow your
              business faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                <Link href="/resources/knowledge-base">Browse Knowledge Base</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-[#F67721] hover:bg-[#F67721]/10 bg-transparent"
                asChild
              >
                <Link href="/resources/support">Get Support</Link>
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

      {/* Featured Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Featured Resources</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Popular guides, tutorials, and tools to help you get started quickly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featuredResources.map((resource, index) => (
              <Card
                key={index}
                className="bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group cursor-pointer"
              >
                <Link href={resource.href}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30 text-xs">
                        {resource.type}
                      </Badge>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {resource.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-[#F5F906] transition-colors">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-sm leading-relaxed">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#F67721]">{resource.category}</span>
                      <ArrowRight className="h-4 w-4 text-[#F67721] group-hover:text-[#F5F906] group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Resource Categories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find exactly what you need with our organized resource categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {resourceCategories.map((category, index) => (
              <Card
                key={index}
                className={`bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group cursor-pointer relative ${
                  category.popular ? "ring-2 ring-[#F67721]/50" : ""
                }`}
              >
                {category.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#F67721] text-white">Most Popular</Badge>
                  </div>
                )}
                <Link href={category.href}>
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-[#F5F906] transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300 leading-relaxed">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-[#92E138]" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-[#F67721] group-hover:text-[#F5F906] transition-colors">
                      <span className="text-sm font-medium">Explore resources</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#08042B] via-[#0A0B2E] to-[#1A0B3D]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Need More Help?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our support team is here to help you succeed. Get personalized assistance and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                <Link href="/resources/support">
                  Contact Support
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-[#F67721] hover:bg-[#F67721]/10 bg-transparent"
                asChild
              >
                <Link href="/resources/community">Join Community</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">Available 24/7 • Expert support team • Fast response times</p>
          </div>
        </div>
      </section>
    </div>
  )
}
