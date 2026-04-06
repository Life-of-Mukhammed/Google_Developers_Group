
import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { FeatureTicker } from "@/components/landing/FeatureTicker"
import { Features } from "@/components/landing/Features"
import { SuccessStories } from "@/components/landing/SuccessStories"
import { Pricing } from "@/components/landing/Pricing"
import { Partners } from "@/components/landing/Partners"
import { CTA } from "@/components/landing/CTA"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <Navbar />
      <Hero />
      <FeatureTicker />
      <Features />
      <Pricing />
      <SuccessStories />
      <Partners />
      <CTA />
      <Footer />
    </main>
  )
}
