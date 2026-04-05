import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { ArrowRight, MapPin, Shield, Truck, CheckCircle } from "lucide-react"

export default function HeroSection() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1769144256207-bc4bb75b29db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHxjYXJnb3NoaXBwaW5nJTIwY29udGFpbmVyc3BvcnQlMjBhZXJpYWx8ZW58MHx8fHwxNzc0MTg0MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Shipping port"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.22_0_0_/_0.92)] via-[oklch(0.22_0_0_/_0.85)] to-[oklch(0.47_0.15_24.94_/_0.75)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Chine <span className="text-white/60">→</span> Côte d'Ivoire</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6"
            >
              Votre agent de
              <span className="text-primary"> sourcing </span>
              de confiance
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed"
            >
              Nous trouvons, inspectons et expéditions vos produits depuis la Chine
              directement vers la Côte d'Ivoire. Qualité garantie, prix
              compétitifs, zéro stress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollTo("#contact")}
                className="gap-2 text-base px-8"
              >
                Commencer maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("#services")}
                className="text-base px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Nos services
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-6"
            >
              {[
                { icon: Shield, label: "Paiement sécurisé" },
                { icon: CheckCircle, label: "Qualité garantie" },
                { icon: Truck, label: "Livraison rapide" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/70">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-1">500+</div>
                  <div className="text-white/70 text-sm">Commandes livrées</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-primary mb-1">98%</div>
                  <div className="text-white/70 text-sm">Satisfaction client</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-1">5 ans</div>
                  <div className="text-white/70 text-sm">D'expérience</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-white mb-1">24h</div>
                  <div className="text-white/70 text-sm">Réponse garantie</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
