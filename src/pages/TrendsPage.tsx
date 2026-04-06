import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { trendingProductsApi } from "@/lib/api"
import type { TrendingProduct } from "@/lib/api"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export default function TrendsPage() {
  const [products, setProducts] = useState<TrendingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleProductClick = (product: TrendingProduct) => {
    const params = new URLSearchParams()
    params.set("product", product.name)
    if (product.category) params.set("category", product.category)
    if (product.description) params.set("description", product.description)
    if (product.image_url) params.set("image", product.image_url)
    if (product.image_url_2) params.set("image_2", product.image_url_2)
    if (product.image_url_3) params.set("image_3", product.image_url_3)
    if (product.image_url_4) params.set("image_4", product.image_url_4)
    navigate(`/portal/requests/new?${params.toString()}`)
  }

  useEffect(() => {
    trendingProductsApi.getActive()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background dark:bg-[oklch(0.12_0_0)]">
      <Helmet>
        <title>Nouveautés - HST Trading</title>
        <meta name="description" content="Découvrez les derniers produits tendance importés de Chine. Smartphones, sneakers,electronics et plus encore." />
        <meta property="og:title" content="Nouveautés - HST Trading" />
        <meta property="og:description" content="Découvrez les derniers produits tendance importés de Chine." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hst-trading.vercel.app/trends" />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Nouveautés
            </span>
            <h1 className="text-4xl font-bold mt-3 mb-4 text-foreground dark:text-[oklch(0.95_0_0)] text-balance">
              Découvrez nos nouveaux produits
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto dark:text-[oklch(0.75_0_0_/0.6)]">
              Les dernières nouveautés que nous proposons sur le marché
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun produit tendance disponible.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-card border border-border dark:bg-[oklch(0.2_0_0)] dark:border-[oklch(0.3_0_0)] group hover:border-primary transition-colors">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-[oklch(0.75_0_0_/0.3)]">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground dark:text-[oklch(0.95_0_0)] mt-3">
                    {product.name}
                  </h3>
                  {product.category && (
                    <p className="text-sm text-muted-foreground dark:text-[oklch(0.75_0_0_/0.6)]">{product.category}</p>
                  )}
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 dark:text-[oklch(0.75_0_0_/0.5)]">
                      {product.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/portal/requests/new"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
