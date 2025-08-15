import { HeroSection } from "./components/hero-section"
import { FeaturesSection } from "./components/features-section"
import { PricingSection } from "./components/pricing-section"
import { TestimonialsSection } from "./components/testimonials-section"
import { CTASection } from "./components/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#08042B] text-white">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
