import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import ServicesSection from "./components/ServicesSection"
import HowItWorksSection from "./components/HowItWorksSection"
import WhyUsSection from "./components/WhyUsSection"
import ProductsSection from "./components/ProductsSection"
import ContactSection from "./components/ContactSection"
import Footer from "./components/Footer"

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <WhyUsSection />
      <ProductsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
