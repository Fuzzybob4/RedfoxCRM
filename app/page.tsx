import { HeroSection } from "@/app/components/hero-section"
import { FeaturesSection } from "@/app/components/features-section"
import { TestimonialsSection } from "@/app/components/testimonials-section"
import { PricingSection } from "@/app/components/pricing-section"
import { CTASection } from "@/app/components/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#08042B]">
      <div className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  )
}
