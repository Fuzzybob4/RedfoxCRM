import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for solo business owners and small startups",
    price: "19",
    trial: "14-day free trial",
    features: [
      "Basic scheduling with calendar interface",
      "Simple booking page",
      "Up to 2 team members",
      "Basic analytics & reports",
      "Single service type (Holiday or Lawn Care)",
    ],
    popular: false,
    href: "/signup?plan=starter",
  },
  {
    name: "Professional",
    description: "For growing businesses with multiple teams",
    price: "85",
    features: [
      "Advanced scheduling & routing",
      "Basic invoicing and payment",
      "Up to 5 team members",
      "Advanced analytics & reporting",
      "Customers mapping",
      "Inventory management",
      "Custom branding",
    ],
    popular: true,
    buttonText: "Choose Professional Plan",
    href: "/signup?plan=professional",
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: "Custom",
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
    popular: false,
    href: "/sales",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Choose Your Plan</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. All plans include our core CRM features, with additional
            capabilities as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" && <span className="text-sm text-gray-300">$</span>}
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-300">/month</span>}
                  </div>
                  {plan.trial && <p className="text-sm text-[#92E138] mt-1">{plan.trial}</p>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-[#92E138]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" asChild>
                  <Link href={plan.href}>
                    {plan.buttonText || (plan.price === "Custom" ? "Contact Sales" : "Start Free Trial")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
