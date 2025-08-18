import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"
import { FeaturesSection } from "./components/features-section"
import { TestimonialsSection } from "./components/testimonials-section"
import { PricingSection } from "./components/pricing-section"
import { CTASection } from "./components/cta-section"
import { Footer } from "./components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
