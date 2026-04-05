import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageSearch, ArrowRight, Clock } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { requestsApi, type Request } from "@/lib/api"

type FilterStatus = "all" | "active" | "delivered" | "cancelled"

const FILTER_TABS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "En cours" },
  { key: "delivered", label: "Livrées" },
  { key: "cancelled", label: "Annulées" },
]

const statusLabels: Record<string, { label: string; className: string }> = {
  new: { label: "Nouvelle", className: "bg-blue-100 text-blue-700 border-blue-200" },
  quoted: { label: "Devis envoyé", className: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmée", className: "bg-purple-100 text-purple-700 border-purple-200" },
  in_production: { label: "En production", className: "bg-orange-100 text-orange-700 border-orange-200" },
  inspecting: { label: "En inspection", className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  shipped: { label: "Expédiée", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  delivered: { label: "Livrée", className: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-700 border-red-200" },
}

function formatDistanceToNow(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "aujourd'hui"
  if (diffDays === 1) return "hier"
  if (diffDays < 7) return `il y a ${diffDays} jours`
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`
  return `il y a ${Math.floor(diffDays / 30)} mois`
}

export default function PortalDashboard() {
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    try {
      setLoading(true)
      setError(null)
      const data = await requestsApi.getAll()
      setRequests(data)
    } catch (err) {
      console.error("Failed to load requests:", err)
      setError("Erreur lors du chargement des demandes")
    } finally {
      setLoading(false)
    }
  }

  const total = requests.length
  const active = requests.filter(r => !["delivered", "cancelled"].includes(r.status)).length
  const delivered = requests.filter(r => r.status === "delivered").length

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true
    if (filter === "active") return !["delivered", "cancelled"].includes(r.status)
    if (filter === "delivered") return r.status === "delivered"
    if (filter === "cancelled") return r.status === "cancelled"
    return true
  })

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-xl"></div>)}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PackageSearch className="w-12 h-12 text-destructive mb-4" />
            <h3 className="font-semibold mb-2">Erreur</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadRequests}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos demandes et suivez leur avancement
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Total", value: total, color: "text-foreground" },
          { label: "En cours", value: active, color: "text-primary" },
          { label: "Livrées", value: delivered, color: "text-green-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mes demandes</h2>
          <Button asChild size="sm">
            <Link to="/portal/requests/new">Nouvelle demande</Link>
          </Button>
        </div>

        <div className="flex gap-1 mb-5 bg-muted/50 rounded-xl p-1 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap",
                filter === tab.key
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <PackageSearch className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucune demande</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Soumettez votre première demande de sourcing.
              </p>
              <Button asChild>
                <Link to="/portal/requests/new">Créer une demande</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req, i) => {
              const statusConfig = statusLabels[req.status] || { label: req.status, className: "" }
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/portal/requests/${req.id}`}
                    className="block bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <Badge variant="outline" className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {req.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {req.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="text-sm font-medium">{req.quantity} unités</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(req.created_at)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
