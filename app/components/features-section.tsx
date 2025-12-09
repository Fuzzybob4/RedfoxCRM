import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, Calendar, FileText, Shield, MessageSquare } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description:
      "Organize and track all your customer information, service history, and preferences in one centralized location.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Get detailed insights into your business performance with comprehensive reports and real-time analytics.",
  },
  {
    icon: Calendar,
    title: "Scheduling & Calendar",
    description:
      "Efficiently manage appointments, installations, and maintenance schedules with our integrated calendar system.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Store and organize contracts, invoices, photos, and important documents with secure cloud storage.",
  },
  {
    icon: MessageSquare,
    title: "Communication Tools",
    description:
      "Stay connected with customers through integrated messaging, email templates, and automated notifications.",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Enterprise-grade security with data encryption, regular backups, and compliance with industry standards.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Grow Your Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed specifically for home service professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-brand-orange to-brand-yellow rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
