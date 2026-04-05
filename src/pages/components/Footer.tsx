import { Package } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[oklch(0.22_0_0)] to-[oklch(0.15_0_0)] text-[oklch(0.75_0_0_/0.7)] py-12 border-t border-[oklch(0.28_0_0)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-[oklch(0.95_0_0)]">
                <span className="text-primary">HST</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Votre partenaire de confiance pour l'importation depuis la Chine
              vers la Côte d'Ivoire. Sourcing, inspection et logistique.
            </p>
          </div>

          <div>
            <h4 className="text-[oklch(0.95_0_0)] font-semibold mb-3 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              {["Sourcing produit", "Inspection qualité", "Shopping agent", "Expédition"].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[oklch(0.95_0_0)] font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Abidjan, Côte d'Ivoire</li>
              <li>+225 07 XX XX XX XX</li>
              <li>contact@hst-trading.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[oklch(0.95_0_0_/0.1)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} HST Trading. Tous droits réservés.
          </p>
          <p className="text-xs">
            Chine → Côte d'Ivoire · Sourcing · Inspection · Logistique
          </p>
        </div>
      </div>
    </footer>
  )
}
