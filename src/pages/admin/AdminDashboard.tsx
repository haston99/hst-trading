import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, DollarSign, Package, AlertCircle, CheckCircle } from "lucide-react"
import { motion } from "motion/react"
import { requestsApi, type Request } from "@/lib/api"

const statusLabels: Record<string, { label: string; className: string }> = {
  new: { label: "Nouvelle", className: "bg-blue-100 text-blue-700 border-blue-200" },
  quoted: { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmée", className: "bg-purple-100 text-purple-700 border-purple-200" },
  in_production: { label: "En production", className: "bg-orange-100 text-orange-700 border-orange-200" },
  inspecting: { label: "En inspection", className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  shipped: { label: "Expédiée", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  delivered: { label: "Livrée", className: "bg-green-100 text-green-700 border-green-200" },
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 0) return "aujourd'hui"
  if (diffDays === 1) return "hier"
  return `${diffDays}j`
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    try {
      setLoading(true)
      const data = await requestsApi.getAll()
      setRequests(data)
    } catch (err) {
      console.error("Failed to load requests:", err)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    revenue: requests.filter(r => r.status !== "new" && r.quoted_price).reduce((sum, r) => sum + (r.quoted_price || 0) * r.quantity, 0),
    pendingQuotes: requests.filter(r => r.status === "new").length,
    inProgress: requests.filter(r => ["quoted", "confirmed", "in_production", "inspecting"].includes(r.status)).length,
    delivered: requests.filter(r => r.status === "delivered").length,
  }

  const priorityRequests = requests
    .filter(r => r.status === "new" || (r.status === "quoted" && !r.quoted_price))
    .slice(0, 5)

  const recentRequests = requests
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8)

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl"></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ce qui требу votre attention</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-green-700">{stats.revenue.toLocaleString()}</div>
                <div className="text-sm text-green-600/70">Revenus (XOF)</div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-red-700">{stats.pendingQuotes}</div>
                <div className="text-sm text-red-600/70">Devis à faire</div>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-blue-700">{stats.inProgress}</div>
                <div className="text-sm text-blue-600/70">En cours</div>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-emerald-700">{stats.delivered}</div>
                <div className="text-sm text-emerald-600/70">Livrées</div>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {priorityRequests.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Actions prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priorityRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => navigate(`/admin/requests/${req.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div>
                      <div className="font-medium">{req.title}</div>
                      <div className="text-sm text-muted-foreground">{req.quantity} unités</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                      {req.status === "new" ? "Nouveau" : "En attente devis"}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentRequests.map((req, i) => {
              const statusConfig = statusLabels[req.status] || { label: req.status, className: "" }
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/requests/${req.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{req.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{req.quantity} unités</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(req.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                    {req.quoted_price && (
                      <span className="text-sm font-medium text-green-600">
                        {req.quoted_price.toLocaleString()} XOF
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
