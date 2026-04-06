import { Helmet } from "react-helmet-async"
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
      <Helmet>
        <title>HST Trading - Sourcing & Inspection Chine vers Côte d'Ivoire</title>
        <meta name="description" content="HST Trading plateforme d'importation Chine-Côte d'Ivoire. Services d'approvisionnement, inspection qualité et shipping vers Abidjan." />
        <meta name="keywords" content="sourcing, import Chine, Côte d'Ivoire, inspection produits, shipping Abidjan, ecommerce Afrique" />
        <meta property="og:title" content="HST Trading - Sourcing & Inspection Chine vers Côte d'Ivoire" />
        <meta property="og:description" content="Plateforme d'importation professionnelle Chine-Côte d'Ivoire. Services d'approvisionnement, inspection qualité et livraison." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HST Trading - Sourcing & Inspection" />
        <meta name="twitter:description" content="Importez vos produits de Chine en toute confiance. Inspection qualité et shipping inclus." />
        <link rel="canonical" href="https://hst-trading.vercel.app/" />
      </Helmet>
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
