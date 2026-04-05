import { motion } from "motion/react"
import { BadgeCheck, Clock, Globe, HeadphonesIcon, Lock, TrendingDown } from "lucide-react"

const reasons = [
  {
    icon: Globe,
    title: "Réseau de fournisseurs établi",
    description: "Plus de 200 fournisseurs vérifiés dans les principales zones industrielles chinoises : Guangzhou, Shenzhen, Yiwu, Ningbo.",
  },
  {
    icon: BadgeCheck,
    title: "Qualité certifiée",
    description: "Chaque commande passe par notre processus d'inspection rigoureux. Vous recevez exactement ce que vous avez commandé.",
  },
  {
    icon: TrendingDown,
    title: "Prix d'usine négociés",
    description: "Grâce à notre présence locale et nos relations avec les fournisseurs, nous obtenons les meilleurs prix du marché.",
  },
  {
    icon: Clock,
    title: "Délais maîtrisés",
    description: "Suivi de commande en temps réel. Vous êtes informé à chaque étape, de la production jusqu'à la livraison à Abidjan.",
  },
  {
    icon: Lock,
    title: "Paiements sécurisés",
    description: "Votre argent est protégé. Nous ne libérons le paiement fournisseur qu'après validation de l'inspection qualité.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support francophone 7j/7",
    description: "Notre équipe bilingue français-chinois est disponible pour répondre à toutes vos questions rapidement.",
  },
]

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Pourquoi nous choisir
            </span>
            <h2 className="text-4xl font-bold mt-3 mb-6 text-balance">
              L'expertise locale au service de votre business
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Importer depuis la Chine seul peut être risqué : arnaques,
              mauvaise qualité, retards... Avec HST, vous avez un
              partenaire de confiance qui connaît le terrain et parle votre langue.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "500+", label: "Commandes" },
                { value: "98%", label: "Satisfaction" },
                { value: "24h", label: "Réponse" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-muted/60 border border-border">
                  <div className="text-2xl font-black text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((reason, i) => {
              const Icon = reason.icon
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{reason.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
