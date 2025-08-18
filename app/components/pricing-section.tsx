import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small businesses just getting started",
    features: ["Up to 100 customers", "Basic scheduling", "Email support", "Mobile app access", "Basic reporting"],
  },
  {
    name: "Professional",
    price: "$79",
    description: "Ideal for growing businesses with advanced needs",
    features: [
      "Up to 1,000 customers",
      "Advanced scheduling",
      "Priority support",
      "Route optimization",
      "Advanced reporting",
      "Team management",
      "Custom fields",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    description: "For large businesses with complex requirements",
    features: [
      "Unlimited customers",
      "White-label options",
      "24/7 phone support",
      "API access",
      "Custom integrations",
      "Advanced analytics",
      "Multi-location support",
    ],
  },
]

export function PricingSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business size and needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 ${plan.popular ? "border-orange-500 shadow-xl" : "border-gray-200"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#F67721] to-[#F5F906] text-black hover:opacity-90"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <Link href="/contact-sales" className="text-orange-600 hover:text-orange-700 font-semibold">
            Need a custom plan? Contact our sales team →
          </Link>
        </div>
      </div>
    </section>
  )
}
