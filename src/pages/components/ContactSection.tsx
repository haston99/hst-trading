import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Mail, MessageCircle, Phone, Package, LogIn } from "lucide-react"

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-muted/40">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Contactez-nous
          </span>
          <h2 className="text-4xl font-bold mt-3 mb-4 text-balance">
            Démarrez votre importation aujourd'hui
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Décrivez votre besoin et recevez une réponse personnalisée sous 24h.
            Aucun engagement, devis gratuit.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-bold">Nos coordonnées</h3>

              {[
                {
                  icon: Phone,
                  label: "WhatsApp / Téléphone",
                  value: "+225 07 XX XX XX XX",
                  sub: "Disponible 7j/7 de 8h à 20h",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "contact@hst-trading.com",
                  sub: "Réponse sous 24 heures",
                },
                {
                  icon: MessageCircle,
                  label: "WeChat (pour la Chine)",
                  value: "HST_Trading",
                  sub: "Pour contacter nos agents en Chine",
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        {item.label}
                      </div>
                      <div className="font-semibold mt-0.5">{item.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.sub}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <h4 className="font-bold text-lg mb-2">Devis gratuit en 24h</h4>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Envoyez-nous votre demande et recevez une proposition
                détaillée : prix fournisseur, frais de transport, délais
                estimés, et tarifs d'inspection.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">
                  Soumettez votre demande en ligne
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accédez à votre espace client pour soumettre une demande de
                  sourcing, suivre l'avancement de vos commandes et échanger
                  directement avec notre équipe.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-muted/60 border border-border rounded-xl px-4 py-3 flex items-start gap-3 text-left mb-3">
                  <LogIn className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Connectez-vous pour accéder à votre{" "}
                    <span className="font-semibold text-foreground">
                      Espace Client
                    </span>{" "}
                    et soumettre une demande.
                  </p>
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link to="/portal">Se connecter / S'inscrire</Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Connexion requise · Devis gratuit sous 24h
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
