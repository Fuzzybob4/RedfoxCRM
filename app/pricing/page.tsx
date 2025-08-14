"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useScrollToTop } from "../hooks/useScrollToTop"
import { Suspense } from "react"

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for solo business owners and small startups",
    monthlyPrice: 19,
    yearlyPrice: 182.4,
    features: [
      "Basic scheduling with calendar interface",
      "Simple booking page",
      "Up to 2 team members",
      "Basic analytics & reports",
      "Single service type (Holiday or Lawn Care)",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
  },
  {
    name: "Professional",
    description: "For growing businesses with multiple teams",
    monthlyPrice: 85,
    yearlyPrice: 816.0,
    features: [
      "Advanced scheduling & routing",
      "Basic invoicing and payment",
      "Up to 5 team members",
      "Advanced analytics & reporting",
      "Customers mapping",
      "Inventory management",
      "Custom branding",
    ],
    cta: "Choose Professional Plan",
    href: "/signup?plan=professional",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    features: [
      "Unlimited scheduling & routing",
      "White-label customer portal",
      "Unlimited team members",
      "Custom analytics & reporting",
      "Pay Roll",
      "Priority support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/sales",
  },
]

function PricingPageContent() {
  const [annualBilling, setAnnualBilling] = useState(false)
  useScrollToTop()

  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Pricing Plans</h1>
        <p className="text-xl text-center text-gray-300 mb-8">Choose the perfect plan for your business needs</p>

        <div className="flex items-center justify-center mb-12">
          <Label htmlFor="billing-toggle" className="mr-2">
            {annualBilling ? "Yearly" : "Monthly"}
          </Label>
          <Switch
            id="billing-toggle"
            checked={annualBilling}
            onCheckedChange={(checked) => {
              setAnnualBilling(checked)
              // You might want to add analytics or other side effects here
            }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden bg-white/10 border-white/20 ${
                plan.popular ? "border-[#F67721]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#F67721] text-white text-sm px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-300">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4 text-white">
                  {typeof plan.monthlyPrice === "number" ? (
                    <>
                      ${annualBilling ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                      <span className="text-xl font-normal text-gray-300">{annualBilling ? "/year" : "/mo"}</span>
                    </>
                  ) : (
                    plan.monthlyPrice
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-[#92E138]" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white">
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08042B] text-white flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <PricingPageContent />
    </Suspense>
  )
}
