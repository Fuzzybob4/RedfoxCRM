import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small businesses getting started",
    features: ["Up to 100 customers", "Basic scheduling", "Email support", "Mobile app access", "Basic reporting"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "Ideal for growing home services businesses",
    features: [
      "Up to 500 customers",
      "Advanced scheduling & dispatch",
      "Route optimization",
      "Automated messaging",
      "Advanced analytics",
      "Priority support",
      "Document management",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large businesses with complex needs",
    features: [
      "Unlimited customers",
      "Multi-location support",
      "Custom integrations",
      "Advanced security",
      "Dedicated account manager",
      "Custom training",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#08042B] to-[#0A0B2E]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-[#F67721] to-[#F5F906] bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include a 14-day free trial with no credit card
            required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 ${plan.popular ? "ring-2 ring-[#F67721] scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#F67721] to-[#F5F906] text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-white text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/70">{plan.period}</span>
                </div>
                <CardDescription className="text-white/70">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-white/90">
                      <Check className="h-5 w-5 text-[#F5F906] mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-white border-0"
                      : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={plan.cta === "Contact Sales" ? "/contact-sales" : "/signup"}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/70 mb-4">All plans include 14-day free trial • No setup fees • Cancel anytime</p>
          <Link href="/pricing" className="text-[#F5F906] hover:text-white">
            View detailed feature comparison →
          </Link>
        </div>
      </div>
    </section>
  )
}
