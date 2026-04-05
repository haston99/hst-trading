import { motion } from "motion/react"

const steps = [
  {
    step: "01",
    title: "Envoyez votre demande",
    description: "Décrivez le produit que vous recherchez : type, quantité, budget cible. Nous vous répondons sous 24h.",
  },
  {
    step: "02",
    title: "Sourcing & devis",
    description: "Nos agents locaux en Chine identifient les meilleurs fournisseurs et vous transmettent plusieurs devis comparatifs.",
  },
  {
    step: "03",
    title: "Validation & paiement",
    description: "Vous choisissez le fournisseur. Nous gérons la commande, le paiement et la demande d'échantillons si nécessaire.",
  },
  {
    step: "04",
    title: "Inspection avant expédition",
    description: "Nos inspecteurs vérifient la qualité, la quantité et le conditionnement. Vous recevez un rapport photo complet.",
  },
  {
    step: "05",
    title: "Expédition & dédouanement",
    description: "Les marchandises sont expédiées vers Abidjan (maritime ou aérien). Nous gérons toutes les formalités douanières.",
  },
  {
    step: "06",
    title: "Livraison à Abidjan",
    description: "Votre cargaison arrive en Côte d'Ivoire. Nous pouvons organiser la livraison finale à votre entrepôt ou adresse.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Le processus
          </span>
          <h2 className="text-4xl font-bold mt-3 mb-4 text-balance">
            Comment ça marche ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Un processus simple, transparent et sécurisé pour importer depuis
            la Chine sans risques.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-7 relative group hover:shadow-md transition-shadow"
            >
              <div className="text-5xl font-black text-primary/15 absolute top-5 right-6 select-none group-hover:text-primary/25 transition-colors">
                {step.step}
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-4">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
