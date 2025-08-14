import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Users, BarChart3, Bell, Truck, Warehouse, MessageSquare, Settings, Zap } from "lucide-react"
import Link from "next/link"

const features = [
  {
    title: "Smart Scheduling",
    description:
      "Efficiently manage your team's schedule with our intuitive calendar interface. Plan jobs, assign tasks, and track progress in real-time.",
    icon: Calendar,
  },
  {
    title: "Team Management",
    description:
      "Coordinate your crew effectively with role-based access control, time tracking, and performance monitoring tools.",
    icon: Users,
  },
  {
    title: "Analytics & Reporting",
    description:
      "Make data-driven decisions with comprehensive analytics. Track job completion rates, team performance, and business growth.",
    icon: BarChart3,
  },
  {
    title: "Automated Notifications",
    description:
      "Keep everyone in the loop with automated email and SMS reminders for appointments, tasks, and important updates.",
    icon: Bell,
  },
  {
    title: "Route Optimization",
    description:
      "Save time and fuel with intelligent route planning. Optimize your team's daily schedule based on location and job requirements.",
    icon: Truck,
  },
  {
    title: "Inventory Management",
    description:
      "Track your equipment and supplies with ease. Get alerts for low stock and manage maintenance schedules efficiently.",
    icon: Warehouse,
  },
  {
    title: "Customer Communication",
    description:
      "Build stronger relationships with built-in communication tools. Send updates, gather feedback, and manage customer requests.",
    icon: MessageSquare,
  },
  {
    title: "Custom Workflows",
    description: "Tailor the system to your needs with customizable workflows, forms, and automation rules.",
    icon: Settings,
  },
  {
    title: "Real-time Updates",
    description: "Stay informed with instant updates on job status, team location, and customer feedback.",
    icon: Zap,
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features for Your Business</h1>
            <p className="text-lg text-gray-300 mb-8">
              Everything you need to manage your holiday lighting or landscaping business efficiently
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-white/10 border-white/20 p-6 hover:border-[#F67721] transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-[#F67721]/20">
                    <feature.icon className="h-6 w-6 text-[#F67721]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#92E138]">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#F67721]/20 to-[#92E138]/20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of successful businesses using RedFox CRM to streamline their operations
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

