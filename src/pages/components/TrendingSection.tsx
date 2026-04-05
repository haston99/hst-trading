import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { trendingProductsApi } from "@/lib/api"
import type { TrendingProduct } from "@/lib/api"

export default function TrendingSection() {
  const [products, setProducts] = useState<TrendingProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trendingProductsApi.getActive()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || products.length === 0) return null

  return (
    <section className="py-20 bg-[oklch(0.12_0_0)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Tendances
          </span>
          <h2 className="text-4xl font-bold mt-3 mb-4 text-[oklch(0.95_0_0)] text-balance">
            Produits en demande
          </h2>
          <p className="text-[oklch(0.75_0_0_/0.6)] text-lg max-w-xl mx-auto">
            Les produits les plus demandés par nos clients cette semaine
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group"
            >
              <Link to="/portal/requests/new">
                <div className="aspect-square rounded-xl overflow-hidden bg-[oklch(0.2_0_0)] border border-[oklch(0.3_0_0)] group-hover:border-primary transition-colors">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[oklch(0.75_0_0_/0.3)]">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-[oklch(0.95_0_0)] text-sm mt-2 truncate">
                  {product.name}
                </h4>
                {product.category && (
                  <p className="text-[oklch(0.75_0_0_/0.5)] text-xs">{product.category}</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/portal/requests/new"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Demander un devis
          </Link>
        </div>
      </div>
    </section>
  )
}
