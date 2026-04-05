import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight, Clock, DollarSign, Package } from "lucide-react"
import { motion } from "motion/react"
import { requestsApi, type Request } from "@/lib/api"

interface ClientData {
  userId: string
  email: string
  name: string
  requestCount: number
  totalSpent: number
  lastRequest: string
  requests: Request[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      setLoading(true)
      const requests = await requestsApi.getAll()
      
      const clientMap = new Map<string, ClientData>()
      
      for (const req of requests) {
        if (!clientMap.has(req.user_id)) {
          clientMap.set(req.user_id, {
            userId: req.user_id,
            email: `Client ${req.user_id.slice(0, 8)}`,
            name: req.user_id,
            requestCount: 0,
            totalSpent: 0,
            lastRequest: req.created_at,
            requests: []
          })
        }
        const client = clientMap.get(req.user_id)!
        client.requestCount++
        client.requests.push(req)
        if (req.quoted_price) {
          client.totalSpent += req.quoted_price * req.quantity
        }
        if (new Date(req.created_at) > new Date(client.lastRequest)) {
          client.lastRequest = req.created_at
        }
      }
      
      const sortedClients = Array.from(clientMap.values()).sort(
        (a, b) => new Date(b.lastRequest).getTime() - new Date(a.lastRequest).getTime()
      )
      setClients(sortedClients)
    } catch (err) {
      console.error("Failed to load clients:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted rounded-xl"></div>
        ))}
      </div>
    )
  }

  const totalClients = clients.length
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0)
  const totalRequests = clients.reduce((sum, c) => sum + c.requestCount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground mt-1">Gérez vos clients et leur historique</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total clients", value: totalClients, icon: Users, color: "text-foreground" },
          { label: "Total demandes", value: totalRequests, icon: Package, color: "text-blue-600" },
          { label: "Revenus total", value: `${totalRevenue.toLocaleString()} XOF`, icon: DollarSign, color: "text-green-600" },
          { label: "Panier moyen", value: totalClients > 0 ? `${Math.round(totalRevenue / totalClients).toLocaleString()} XOF` : "0 XOF", icon: DollarSign, color: "text-amber-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients ({totalClients})</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun client</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map((client, i) => (
                <motion.div
                  key={client.userId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">{client.email}</span>
                      <Badge variant="outline" className="text-xs">
                        {client.requestCount} demande{client.requestCount > 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(client.lastRequest)}
                      </span>
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign className="w-3 h-3" />
                        {client.totalSpent.toLocaleString()} XOF
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/clients/${client.userId}`)}>
                    Voir
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
