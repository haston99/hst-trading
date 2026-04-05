import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Package, Truck, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { newsPostsApi } from "@/lib/api"
import type { NewsPost } from "@/lib/api"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  new_arrivals: { label: "Nouveauté", icon: Package, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  shipping: { label: "Expédition", icon: Truck, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  market: { label: "Marché", icon: TrendingUp, color: "text-green-400", bgColor: "bg-green-500/10" }
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    newsPostsApi.getActive(20)
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredPosts = filter ? posts.filter(p => p.category === filter) : posts

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[oklch(0.12_0_0)]">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Actualités
            </span>
            <h1 className="text-4xl font-bold mt-3 mb-4 text-foreground dark:text-[oklch(0.95_0_0)] text-balance">
              Dernières nouvelles
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto dark:text-[oklch(0.75_0_0_/0.6)]">
              Restez informé des dernières nouvelles du marché et de nos services
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground dark:bg-[oklch(0.2_0_0)] dark:text-[oklch(0.75_0_0_/0.6)]"
              }`}
            >
              Tous
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground dark:bg-[oklch(0.2_0_0)] dark:text-[oklch(0.75_0_0_/0.6)]"
                }`}
              >
                <config.icon className="w-4 h-4" />
                {config.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune actualité disponible.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post, i) => {
                const config = categoryConfig[post.category]
                const Icon = config?.icon || Package
                const isExpanded = expandedId === post.id

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-xl p-6 dark:bg-[oklch(0.2_0_0)] dark:border-[oklch(0.3_0_0)]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded ${config?.bgColor} ${config?.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config?.label}
                      </span>
                      <span className="text-sm text-muted-foreground dark:text-[oklch(0.75_0_0_/0.5)]">
                        {formatDate(post.published_at)}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-foreground dark:text-[oklch(0.95_0_0)] mb-3">
                      {post.title}
                    </h2>

                    <div className={`text-muted-foreground dark:text-[oklch(0.75_0_0_/0.6)] ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {post.content}
                    </div>

                    {post.content.length > 200 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : post.id)}
                        className="flex items-center gap-1 text-primary text-sm mt-3 hover:underline"
                      >
                        {isExpanded ? (
                          <>Réduire <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>Lire la suite <ChevronDown className="w-4 h-4" /></>
                        )}
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
