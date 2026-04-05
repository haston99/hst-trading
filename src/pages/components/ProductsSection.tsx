import { motion } from "motion/react"

const products = [
  { category: "Électronique & High-Tech", items: "Téléphones, tablettes, accessoires, laptops" },
  { category: "Textile & Mode", items: "Vêtements, chaussures, accessoires de mode" },
  { category: "Matériaux de construction", items: "Carrelage, sanitaires, quincaillerie, électricité" },
  { category: "Cosmétiques & Beauté", items: "Produits capillaires, soins, maquillage" },
  { category: "Équipements industriels", items: "Machines, outils, pièces de rechange" },
  { category: "Alimentation & Épicerie", items: "Produits alimentaires (hors périssables)" },
  { category: "Jouets & Articles enfants", items: "Jeux, poussettes, accessoires bébé" },
  { category: "Mobilier & Décoration", items: "Meubles, luminaires, déco intérieure" },
]

export default function ProductsSection() {
  return (
    <section className="py-20 bg-[oklch(0.15_0_0)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Catalogue
          </span>
          <h2 className="text-4xl font-bold mt-3 mb-4 text-[oklch(0.95_0_0)] text-balance">
            Tous types de produits
          </h2>
          <p className="text-[oklch(0.75_0_0_/0.6)] text-lg max-w-xl mx-auto">
            Nous pouvons sourcer pratiquement n'importe quel produit fabricado
            en Chine. Voici quelques catégories populaires.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((prod, i) => (
            <motion.div
              key={prod.category}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-[oklch(0.2_0_0)] border border-[oklch(0.3_0_0)] rounded-xl p-5 hover:bg-[oklch(0.25_0_0)] transition-colors"
            >
              <h4 className="font-semibold text-[oklch(0.95_0_0)] text-sm mb-1.5">
                {prod.category}
              </h4>
              <p className="text-[oklch(0.75_0_0_/0.5)] text-xs leading-relaxed">{prod.items}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
