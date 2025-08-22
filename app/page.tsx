"use client"

import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"
import { FeaturesSection } from "./components/features-section"
import { TestimonialsSection } from "./components/testimonials-section"
import { PricingSection } from "./components/pricing-section"
import { CTASection } from "./components/cta-section"
import { Footer } from "./components/footer"
import { useScrollToTop } from "./hooks/useScrollToTop"

export default function HomePage() {
  useScrollToTop()

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
