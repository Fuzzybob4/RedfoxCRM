"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for small businesses just getting started",
    features: [
      "Up to 500 customers",
      "Basic scheduling",
      "Email support",
      "Mobile app access",
      "Basic reporting",
      "Invoice generation",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: 79,
    description: "Ideal for growing businesses with advanced needs",
    features: [
      "Up to 2,500 customers",
      "Advanced scheduling & routing",
      "Priority phone support",
      "Team collaboration tools",
      "Advanced analytics",
      "Payment processing",
      "Custom fields",
      "API access",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large businesses requiring maximum flexibility",
    features: [
      "Unlimited customers",
      "White-label options",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "Multi-location support",
      "Custom reporting",
      "24/7 phone support",
    ],
    popular: false,
    cta: "Contact Sales",
  },
]

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#08042B] via-[#1a0f4a] to-[#2d1b69]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your business size and needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white/10 backdrop-blur-sm border-white/20 text-white ${
                plan.popular ? "ring-2 ring-[#F67721] scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-[#F67721] to-[#F5F906] text-[#08042B] font-semibold px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#F67721] flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#F67721] to-[#F5F906] hover:from-[#F5F906] hover:to-[#F67721] text-[#08042B]"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  <Link href={plan.cta === "Contact Sales" ? "/contact-sales" : "/signup"}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-4">
            Need a custom solution? We offer enterprise packages tailored to your specific requirements.
          </p>
          <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Link href="/contact-sales">Contact Our Sales Team</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
