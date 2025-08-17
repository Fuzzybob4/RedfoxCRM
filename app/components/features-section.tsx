import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, BarChart3, MessageSquare, FileText, Shield, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Comprehensive customer profiles with service history, preferences, and communication logs.",
    href: "/features/customers",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Scheduling & Dispatch",
    description: "Smart scheduling with route optimization and real-time crew dispatch management.",
    href: "/features/scheduling",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Business insights with revenue tracking, performance metrics, and growth analytics.",
    href: "/features/analytics",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Communication Tools",
    description: "Automated messaging, customer notifications, and team communication features.",
    href: "/features/communication",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Digital contracts, invoices, estimates, and secure document storage system.",
    href: "/features/documents",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Enterprise-grade security with data encryption and compliance management.",
    href: "/features/security",
    color: "from-indigo-500 to-purple-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#08042B] to-[#0A0B2E]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
              Grow Your Business
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Powerful features designed specifically for home services businesses. Streamline operations, delight
            customers, and scale your business with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-white/70">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={feature.href}>
                  <Button variant="ghost" className="text-[#F5F906] hover:text-white hover:bg-white/10 p-0 h-auto">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white border-0"
          >
            <Link href="/features">
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
