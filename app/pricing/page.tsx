import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small teams getting started",
    features: [
      { name: "Up to 1,000 contacts", included: true },
      { name: "Basic pipeline management", included: true },
      { name: "Email integration", included: true },
      { name: "Mobile app access", included: true },
      { name: "Standard support", included: true },
      { name: "Advanced reporting", included: false },
      { name: "Custom workflows", included: false },
      { name: "API access", included: false },
      { name: "Priority support", included: false },
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    price: "$79",
    description: "Best for growing businesses",
    features: [
      { name: "Up to 10,000 contacts", included: true },
      { name: "Advanced pipeline management", included: true },
      { name: "Email & calendar integration", included: true },
      { name: "Mobile app access", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Custom workflows", included: true },
      { name: "API access", included: true },
      { name: "Custom integrations", included: false },
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "For large organizations",
    features: [
      { name: "Unlimited contacts", included: true },
      { name: "Advanced automation", included: true },
      { name: "Custom integrations", included: true },
      { name: "Advanced security", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom training", included: true },
      { name: "SLA guarantee", included: true },
      { name: "White-label options", included: true },
      { name: "On-premise deployment", included: true },
    ],
    popular: false,
    cta: "Contact Sales",
  },
]

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all plans come with a 14-day free trial. No credit card required to get started.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      <Header />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#F67721]/20 text-[#F5F906] border-[#F67721]/30">Pricing</Badge>
            <h1 className="text-4xl font-bold mb-4 text-white">Simple, transparent pricing</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your business. All plans include a 14-day free trial with no credit card
              required.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/5 border-[#92E138]/20 hover:bg-white/10 transition-all duration-300 ${plan.popular ? "ring-2 ring-[#F67721]/50 scale-105" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#F67721] text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-300">/month</span>
                  </div>
                  <CardDescription className="mt-2 text-gray-300">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-[#92E138] mr-3 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${!feature.included ? "text-gray-500" : "text-gray-300"}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white" : "bg-white/10 border border-[#F67721] text-white hover:bg-[#F67721]/10"}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-white/5 border-[#92E138]/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to get started?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using RedFox CRM to grow their sales and manage customer
              relationships more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F67721] hover:bg-[#F5F906] hover:text-[#08042B] text-white">
                Start Free Trial
              </Button>
              <Button size="lg" className="bg-white/10 border border-[#F67721] text-white hover:bg-[#F67721]/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
