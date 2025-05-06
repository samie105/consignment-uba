import Hero from "@/components/hero"
import Services from "@/components/services"
import About from "@/components/about"
import Gallery from "@/components/gallery"
import ShippingForm from "@/components/shipping-form"
import Contact from "@/components/contact"
import Faq from "@/components/faq"
import SpecializedServices from "@/components/specialized-services"
import Metrics from "@/components/metrics"
import Testimonials from "@/components/testimonials"
import SponsorsSection from "@/components/sponsors-section"
import BackToTop from "@/components/back-to-top"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Metrics />
      <About />
      <Services />
      <SpecializedServices />
      <Testimonials />
      <SponsorsSection />
      <Gallery />
      <ShippingForm />
      <Contact />
      <Faq />
      <BackToTop />
    </main>
  )
}
