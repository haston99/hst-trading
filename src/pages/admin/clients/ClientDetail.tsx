import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Users, Clock, DollarSign, Package, Save, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { requestsApi, type Request } from "@/lib/api"
import { toast } from "sonner"

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [clientNotes, setClientNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (clientId) {
      loadData()
    }
  }, [clientId])

  async function loadData() {
    try {
      setLoading(true)
      const data = await requestsApi.getByUserId(clientId!)
      setRequests(data)
      const notes: Record<string, string> = {}
      data.forEach(r => { notes[r.id] = r.client_notes || "" })
      setClientNotes(notes)
    } catch (err) {
      console.error("Failed to load client:", err)
    } finally {
      setLoading(false)
    }
  }

  async function saveNotes(requestId: string) {
    setSaving(true)
    try {
      await requestsApi.updateClientNotes(requestId, clientNotes[requestId])
      toast.success("Notes enregistrées")
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
        </div>
      </div>
    )
  }

  const totalSpent = requests.filter(r => r.quoted_price).reduce((sum, r) => sum + (r.quoted_price || 0) * r.quantity, 0)
  const activeRequests = requests.filter(r => !["delivered", "cancelled"].includes(r.status))

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <Link to="/admin/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" />
        Retour aux clients
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Client {clientId?.slice(0, 8)}</h1>
              <p className="text-sm text-muted-foreground">Membre depuis {requests.length > 0 ? formatDate(requests[requests.length - 1].created_at) : "..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black">{requests.length}</div>
                <div className="text-sm text-muted-foreground">Total demandes</div>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black">{activeRequests.length}</div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black">{totalSpent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total dépensé (XOF)</div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black">{requests.length > 0 ? Math.round(totalSpent / requests.length).toLocaleString() : 0}</div>
                <div className="text-sm text-muted-foreground">Panier moyen</div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des demandes ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune demande</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req, i) => {
                const statusConfig = statusLabels[req.status] || { label: req.status, className: "" }
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{formatDate(req.created_at)}</span>
                        </div>
                        <h3 className="font-semibold text-lg">{req.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{req.category} · {req.quantity} unités</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/admin/requests/${req.id}`)}>
                        Voir détails
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Budget max:</span>
                        <span className="ml-2 font-medium">{req.budget_per_unit ? `${req.budget_per_unit} ${req.currency}/unité` : "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prix devis:</span>
                        <span className="ml-2 font-medium">{req.quoted_price ? `${req.quoted_price} ${req.currency}/unité` : "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <span className="ml-2 font-medium text-green-600">{req.quoted_price ? `${(req.quoted_price * req.quantity).toLocaleString()} ${req.currency}` : "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Statut:</span>
                        <span className="ml-2 font-medium">{statusConfig.label}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Notes internes sur ce client (pour cette demande)</label>
                        <Button size="sm" variant="outline" onClick={() => saveNotes(req.id)} disabled={saving}>
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span className="ml-1">Enregistrer</span>
                        </Button>
                      </div>
                      <Textarea
                        value={clientNotes[req.id] || ""}
                        onChange={(e) => setClientNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                        placeholder="Notes privées sur ce client pour cette demande..."
                        rows={2}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
