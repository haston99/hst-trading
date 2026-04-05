import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Package, Truck, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { newsPostsApi } from "@/lib/api"
import type { NewsPost } from "@/lib/api"

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  new_arrivals: { label: "Nouveauté", icon: Package, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  shipping: { label: "Expédition", icon: Truck, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  market: { label: "Marché", icon: TrendingUp, color: "text-green-400", bgColor: "bg-green-500/10" }
}

export default function NewsFeedSection() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    newsPostsApi.getActive(5)
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || posts.length === 0) return null

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    })
  }

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
            Actualités
          </span>
          <h2 className="text-4xl font-bold mt-3 mb-4 text-[oklch(0.95_0_0)] text-balance">
            Dernières nouvelles
          </h2>
          <p className="text-[oklch(0.75_0_0_/0.6)] text-lg max-w-xl mx-auto">
            Restez informé des dernières nouvelles du marché et de nos services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const config = categoryConfig[post.category]
            const Icon = config?.icon || Package
            const isExpanded = expandedId === post.id

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[oklch(0.2_0_0)] border border-[oklch(0.3_0_0)] rounded-xl p-5 hover:border-[oklch(0.4_0_0)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${config?.bgColor} ${config?.color}`}>
                    <Icon className="w-3 h-3" />
                    {config?.label}
                  </span>
                  <span className="text-[oklch(0.75_0_0_/0.4)] text-xs">
                    {formatDate(post.published_at)}
                  </span>
                </div>

                <h4 className="font-semibold text-[oklch(0.95_0_0)] mb-2">
                  {post.title}
                </h4>

                <div className={`text-[oklch(0.75_0_0_/0.6)] text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
                  {post.content}
                </div>

                {post.content.length > 150 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
                  >
                    {isExpanded ? (
                      <>Réduire <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Lire plus <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
