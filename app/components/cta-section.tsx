import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#08042B] to-[#1a1f3a]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of home service professionals who trust RedFox CRM to grow their business. Start your free
          trial today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#F67721] to-[#F5F906] text-black font-semibold hover:opacity-90 transition-opacity"
          >
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black bg-transparent"
          >
            <Link href="/contact-sales">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
