import { motion } from "motion/react"
import { Search, ShieldCheck, ShoppingCart, Truck } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Sourcing de Produits",
    description: "Nous identifions les meilleurs fournisseurs chinois pour vos produits : électronique, textile, équipements, matériaux de construction et plus encore.",
    features: ["Sélection des fournisseurs", "Négociation des prix", "Échantillons gratuits"],
    color: "from-amber-500/20 to-orange-500/10",
    iconBg: "bg-amber-500/15 text-amber-700",
  },
  {
    icon: ShieldCheck,
    title: "Inspection Qualité",
    description: "Nos inspecteurs locaux vérifient vos marchandises avant l'expédition pour vous éviter toute mauvaise surprise à la livraison.",
    features: ["Contrôle avant expédition", "Rapport photos détaillé", "Conformité aux normes"],
    color: "from-green-500/20 to-emerald-500/10",
    iconBg: "bg-green-500/15 text-green-700",
  },
  {
    icon: ShoppingCart,
    title: "Shopping Agent",
    description: "Vous voulez acheter sur Alibaba, 1688, Taobao ou d'autres plateformes chinoises ? Nous gérons vos achats de A à Z.",
    features: ["Achat sur toutes plateformes", "Consolidation des colis", "Suivi en temps réel"],
    color: "from-blue-500/20 to-sky-500/10",
    iconBg: "bg-blue-500/15 text-blue-700",
  },
  {
    icon: Truck,
    title: "Expédition & Logistique",
    description: "Transport maritime et aérien depuis les principaux ports chinois jusqu'au port d'Abidjan, avec gestion des formalités douanières.",
    features: ["Maritime & aérien", "Dédouanement inclus", "Livraison à domicile"],
    color: "from-purple-500/20 to-violet-500/10",
    iconBg: "bg-purple-500/15 text-purple-700",
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Ce que nous faisons
          </span>
          <h2 className="text-4xl font-bold mt-3 mb-4 text-balance">
            Nos services de bout en bout
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            De la recherche du produit à la livraison à Abidjan, nous prenons
            en charge chaque étape de votre importation depuis la Chine.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`rounded-2xl bg-gradient-to-br ${service.color} border border-border p-8 hover:shadow-lg transition-shadow`}
              >
                <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
