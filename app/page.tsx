import { HeroSection } from "./components/hero-section"
import { FeaturesSection } from "./components/features-section"
import { PricingSection } from "./components/pricing-section"
import { TestimonialsSection } from "./components/testimonials-section"
import { CTASection } from "./components/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
