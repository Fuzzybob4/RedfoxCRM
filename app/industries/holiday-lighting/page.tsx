import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Calendar,
  Truck,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Package,
  Phone,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: Calendar,
    title: "Installation Scheduling",
    description:
      "Schedule and manage hundreds of holiday lighting installations with automated crew assignments and route optimization.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Track customer preferences, installation notes, and service history for repeat seasonal customers.",
  },
  {
    icon: Package,
    title: "Equipment Tracking",
    description:
      "Manage inventory of lights, timers, extension cords, and installation equipment across multiple job sites.",
  },
  {
    icon: DollarSign,
    title: "Seasonal Billing",
    description:
      "Automated invoicing for installations, monthly service fees, and take-down services with payment tracking.",
  },
  {
    icon: Truck,
    title: "Route Optimization",
    description: "Optimize crew routes for installations and service calls to maximize efficiency during busy season.",
  },
  {
    icon: Phone,
    title: "Customer Communication",
    description: "Automated reminders for installations, service appointments, and take-down scheduling.",
  },
]

const workflows = [
  {
    phase: "Pre-Season Planning",
    icon: Calendar,
    tasks: [
      "Import previous year's customer list",
      "Schedule site visits and estimates",
      "Plan crew schedules and equipment needs",
      "Send early bird pricing to past customers",
    ],
  },
  {
    phase: "Installation Season",
    icon: Truck,
    tasks: [
      "Daily crew scheduling and route optimization",
      "Real-time job status updates",
      "Photo documentation of installations",
      "Customer approval and sign-off tracking",
    ],
  },
  {
    phase: "Maintenance Period",
    icon: Sparkles,
    tasks: [
      "Service call scheduling and tracking",
      "Bulb replacement and repair logs",
      "Customer satisfaction follow-ups",
      "Monthly billing and payment processing",
    ],
  },
  {
    phase: "Take-Down Season",
    icon: Package,
    tasks: [
      "Automated take-down scheduling",
      "Equipment inventory and storage tracking",
      "Final billing and payment collection",
      "Next season planning and customer retention",
    ],
  },
]

const testimonials = [
  {
    name: "Mike Rodriguez",
    company: "Bright Nights Holiday Lighting",
    location: "Denver, CO",
    image: "/professional-man-headshot.png",
    quote:
      "RedFox CRM helped us manage 400+ holiday lighting installations this season. The scheduling and customer tracking features are game-changers.",
    results: "400+ installations managed",
    rating: 5,
  },
  {
    name: "Jennifer Walsh",
    company: "Festive Lights Co.",
    location: "Chicago, IL",
    image: "/professional-woman-headshot.png",
    quote:
      "The route optimization saved us 3 hours per day during installation season. Our crews are more efficient than ever.",
    results: "3 hours saved daily",
    rating: 5,
  },
]

const stats = [
  { label: "Holiday Lighting Contractors", value: "1,200+", icon: Sparkles },
  { label: "Installations Managed", value: "75K+", icon: Calendar },
  { label: "Average Revenue Increase", value: "+58%", icon: DollarSign },
  { label: "Customer Retention Rate", value: "92%", icon: Users },
]

export default function HolidayLightingPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F5F906]/20 to-[#92E138]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#F67721]/10 to-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-red-500/20 text-green-400 border-red-500/30 text-lg px-4 py-2">
              Holiday Lighting CRM
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Manage Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">
                Holiday Lighting
              </span>{" "}
              Business
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From installation scheduling to take-down management, RedFox CRM helps holiday lighting contractors
              streamline operations, track equipment, and delight customers season after season.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-green-600 text-white" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-red-500 hover:bg-red-500/10 bg-transparent"
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
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything You Need for Holiday Lighting</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized features designed specifically for holiday lighting contractors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-green-500/20 hover:bg-white/10 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Workflow */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Seasonal Workflow Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              RedFox CRM guides you through every phase of the holiday lighting season
            </p>
          </div>

          <Tabs defaultValue="planning" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="planning" className="data-[state=active]:bg-red-500">
                Pre-Season
              </TabsTrigger>
              <TabsTrigger value="installation" className="data-[state=active]:bg-red-500">
                Installation
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-red-500">
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="takedown" className="data-[state=active]:bg-red-500">
                Take-Down
              </TabsTrigger>
            </TabsList>

            {workflows.map((workflow, index) => (
              <TabsContent key={index} value={workflow.phase.toLowerCase().replace(/[^a-z]/g, "")} className="mt-8">
                <Card className="bg-white/5 border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center">
                        <workflow.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-white">{workflow.phase}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {workflow.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how holiday lighting contractors are growing their businesses with RedFox CRM
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-green-500/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#F5F906] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic text-lg">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.company}</div>
                        <div className="text-xs text-red-400">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{testimonial.results}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-900/20 via-[#08042B] to-green-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready for Your Best Holiday Season Yet?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join over 1,200 holiday lighting contractors who trust RedFox CRM to manage their seasonal business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-green-600 text-white" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-red-500 hover:bg-red-500/10 bg-transparent"
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
