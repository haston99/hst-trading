import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { ChevronLeft, CheckCircle2, Circle, Send, Loader2, Save, Image } from "lucide-react"
import { toast } from "sonner"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { requestsApi, messagesApi, quotesApi, activityLogsApi, type Request, type Message, type Quote, type ActivityLog } from "@/lib/api"
import { realtime, client } from "@/lib/insforge"

const STATUS_STEPS = ["new", "quoted", "confirmed", "in_production", "inspecting", "shipped", "delivered"]

const stepLabels: Record<string, string> = {
  new: "Demande reçue",
  quoted: "Devis envoyé",
  confirmed: "Commande confirmée",
  in_production: "En production",
  inspecting: "Inspection qualité",
  shipped: "Expédiée",
  delivered: "Livrée",
}

const statusLabels: Record<string, { label: string; className: string }> = {
  new: { label: "Nouvelle", className: "bg-blue-100 text-blue-700 border-blue-200" },
  quoted: { label: "Devis envoyé", className: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmée", className: "bg-purple-100 text-purple-700 border-purple-200" },
  in_production: { label: "En production", className: "bg-orange-100 text-orange-700 border-orange-200" },
  inspecting: { label: "En inspection", className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  shipped: { label: "Expédiée", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  delivered: { label: "Livrée", className: "bg-green-100 text-green-700 border-green-200" },
}

function TrackingTimeline({ status, onStepClick }: { status: string; onStepClick: (step: string) => void }) {
  const currentIndex = STATUS_STEPS.indexOf(status)

  return (
    <div className="flex items-start gap-0">
      {STATUS_STEPS.map((step, i) => {
        const isDone = i <= currentIndex
        const isCurrent = i === currentIndex
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {i > 0 && <div className={cn("flex-1 h-0.5 transition-colors cursor-pointer", isDone ? "bg-primary" : "bg-border", "hover:bg-primary/50")} onClick={() => onStepClick(STATUS_STEPS[i - 1])} />}
              <button
                onClick={() => onStepClick(step)}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all shrink-0 hover:scale-110",
                  isCurrent ? "border-primary bg-primary text-primary-foreground scale-110" : isDone ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"
                )}
              >
                {isDone && !isCurrent ? <CheckCircle2 className="w-4 h-4 fill-primary text-primary-foreground" /> : isCurrent ? <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" /> : <Circle className="w-3.5 h-3.5" />}
              </button>
              {i < STATUS_STEPS.length - 1 && <div className={cn("flex-1 h-0.5 transition-colors cursor-pointer", i < currentIndex ? "bg-primary" : "bg-border", "hover:bg-primary/50")} onClick={() => onStepClick(STATUS_STEPS[i + 1])} />}
            </div>
            <div className={cn("text-[10px] text-center mt-2 leading-tight px-1", isCurrent ? "text-primary font-semibold" : isDone ? "text-foreground/70" : "text-muted-foreground")}>
              {stepLabels[step]}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AdminRequestDetail() {
  const { requestId } = useParams<{ requestId: string }>()
  const [request, setRequest] = useState<Request | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [content, setContent] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [quotedPrice, setQuotedPrice] = useState<string>("")
  const [adminNotes, setAdminNotes] = useState<string>("")
  const [newQuotePrice, setNewQuotePrice] = useState<string>("")
  const [newQuoteNotes, setNewQuoteNotes] = useState<string>("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (requestId) {
      loadData()
      setupRealtime()
    }
    return () => {
      if (requestId) {
        realtime.unsubscribe(`request:${requestId}`)
      }
    }
  }, [requestId])

  const setupRealtime = async () => {
    try {
      await realtime.connect()
      await realtime.subscribe(`request:${requestId}`)
      realtime.on<{ type: string; message: Message }>(`request:${requestId}`, (payload) => {
        if (payload.type === "new_message") {
          setMessages((prev) => [...prev, payload.message])
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
        }
      })
    } catch (err) {
      console.error("Realtime error:", err)
    }
  }

  async function loadData() {
    try {
      setLoading(true)
      const [reqData, msgsData, quotesData, logsData] = await Promise.all([
        requestsApi.getById(requestId!),
        messagesApi.getByRequestId(requestId!),
        quotesApi.getByRequestId(requestId!),
        activityLogsApi.getByRequestId(requestId!)
      ])
      setRequest(reqData)
      setMessages(msgsData)
      setQuotes(quotesData)
      setActivityLogs(logsData)
      if (reqData) {
        setQuotedPrice(reqData.quoted_price?.toString() || "")
        setAdminNotes(reqData.admin_notes || "")
      }
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
    } catch (err) {
      console.error("Failed to load request:", err)
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!request) return
    try {
      const oldStatus = request.status
      const updated = await requestsApi.updateStatus(request.id, newStatus)
      setRequest(updated)
      await activityLogsApi.create({
        request_id: request.id,
        action: 'status_changed',
        details: { from: oldStatus, to: newStatus }
      })
      toast.success("Statut mis à jour")
    } catch (err) {
      console.error("Failed to update status:", err)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const handleSaveQuote = async () => {
    if (!request) return
    setSaving(true)
    try {
      const quoted = quotedPrice ? parseFloat(quotedPrice) : null
      const { data, error } = await client.database.from('requests').update({ 
        quoted_price: quoted, 
        admin_notes: adminNotes,
        status: quoted ? 'quoted' : request.status,
        updated_at: new Date().toISOString() 
      }).eq('id', request.id).select().single()
      if (error) throw error
      setRequest(data)
      toast.success("Devis enregistré")
    } catch (err) {
      console.error("Failed to save quote:", err)
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const handleCreateQuote = async () => {
    if (!request || !newQuotePrice) return
    setSaving(true)
    try {
      const quote = await quotesApi.create({
        request_id: request.id,
        price_per_unit: parseFloat(newQuotePrice),
        currency: request.currency,
        notes: newQuoteNotes || undefined
      })
      setQuotes(prev => [quote, ...prev])
      await activityLogsApi.create({
        request_id: request.id,
        action: 'quote_created',
        details: { price: newQuotePrice, quote_id: quote.id }
      })
      setNewQuotePrice("")
      setNewQuoteNotes("")
      toast.success("Devis créé !")
    } catch (err) {
      console.error("Failed to create quote:", err)
      toast.error("Erreur lors de la création")
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async () => {
    if (!content.trim() || !requestId) return
    setSending(true)
    try {
      const newMsg = await messagesApi.create({
        request_id: requestId,
        content: content.trim(),
        sender_role: "admin",
        image_url: uploadedImages[0] || undefined,
      })
      setMessages(prev => [...prev, newMsg])
      setContent("")
      setUploadedImages([])
      setShowImageUpload(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
      
      if (realtime.isConnected) {
        await realtime.publish(`request:${requestId}`, "new_message", { type: "new_message", message: newMsg })
      }
      
      toast.success("Message envoyé !")
    } catch (err) {
      console.error("Failed to send message:", err)
      toast.error("Erreur lors de l'envoi.")
    } finally {
      setSending(false)
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

  if (!request) {
    return (
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="font-semibold mb-2">Demande non trouvée</h3>
            <Button asChild>
              <Link to="/admin">Retour au dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = statusLabels[request.status] || { label: request.status, className: "" }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" />
        Retour au dashboard
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={statusConfig.className}>{statusConfig.label}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Soumise le {new Date(request.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Select value={request.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_STEPS.map((step) => (
              <SelectItem key={step} value={step}>
                {statusLabels[step]?.label || step}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-5">Suivi de la commande</h2>
        <TrackingTimeline status={request.status} onStepClick={handleStatusChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Détails de la demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="space-y-3">
                {[
                  { label: "Catégorie", value: request.category },
                  { label: "Quantité", value: `${request.quantity} unités` },
                  { label: "Budget unitaire max", value: request.budget_per_unit ? `${request.budget_per_unit} ${request.currency}` : "Non spécifié" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Devis HST</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prix unitaire (XOF)</Label>
                  <Input
                    type="number"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="Prix unitaire"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total estimé</Label>
                  <div className="h-10 flex items-center text-lg font-semibold">
                    {quotedPrice ? `${(parseFloat(quotedPrice) * request.quantity).toLocaleString()} XOF` : "—"}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes internes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes privées pour cette demande..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveQuote} disabled={saving} className="w-full">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Enregistrer le devis
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Créer un nouveau devis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prix unitaire (XOF)</Label>
                  <Input
                    type="number"
                    value={newQuotePrice}
                    onChange={(e) => setNewQuotePrice(e.target.value)}
                    placeholder="Prix unitaire"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <div className="h-10 flex items-center text-lg font-semibold">
                    {newQuotePrice ? `${(parseFloat(newQuotePrice) * request.quantity).toLocaleString()} XOF` : "—"}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (visible par le client)</Label>
                <Textarea
                  value={newQuoteNotes}
                  onChange={(e) => setNewQuoteNotes(e.target.value)}
                  placeholder="Notes pour ce devis..."
                  rows={2}
                />
              </div>
              <Button onClick={handleCreateQuote} disabled={saving || !newQuotePrice} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Créer le devis
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Historique des devis ({quotes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun devis créé</p>
              ) : (
                <div className="space-y-3">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-semibold">{quote.price_per_unit.toLocaleString()} XOF/unit</div>
                        <div className="text-sm text-muted-foreground">
                          Total: {(quote.price_per_unit * request.quantity).toLocaleString()} XOF
                        </div>
                        {quote.notes && (
                          <div className="text-sm text-muted-foreground mt-1">{quote.notes}</div>
                        )}
                      </div>
                      <Badge variant={quote.status === "accepted" ? "default" : quote.status === "rejected" ? "destructive" : "secondary"}>
                        {quote.status === "pending" ? "En attente" : quote.status === "accepted" ? "Accepté" : "Refusé"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Journal d'activité</CardTitle>
            </CardHeader>
            <CardContent>
              {activityLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune activité</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium">{log.action}</span>
                        <span className="text-muted-foreground ml-2">
                          {new Date(log.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-xs text-muted-foreground mt-0.5">{JSON.stringify(log.details)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Description</h2>
              <p className="text-sm leading-relaxed text-foreground/80">{request.description}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-base font-semibold mb-4">Messages</h3>
            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Aucun message
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.sender_role === "admin"
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", isAdmin ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5", isAdmin ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm")}>
                        <div className="text-[10px] opacity-60 mb-1">{isAdmin ? "HST" : "Client"}</div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        {msg.image_url && (
                          <a href={msg.image_url} target="_blank" rel="noopener noreferrer" className="block mt-2">
                            <img src={msg.image_url} alt="Image jointe" className="w-32 h-32 object-cover rounded-lg border" />
                          </a>
                        )}
                        <div className={cn("text-[10px] mt-1 opacity-60", isAdmin ? "text-right" : "text-left")}>
                          {new Date(msg.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea value={content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} placeholder="Répondre au client..." rows={2} className="resize-none" />
                {showImageUpload && (
                  <div className="mt-2">
                    <ImageUpload images={uploadedImages} onImagesChange={setUploadedImages} maxImages={1} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="icon" onClick={() => setShowImageUpload(!showImageUpload)} className="shrink-0 h-10 w-10">
                  <Image className="w-4 h-4" />
                </Button>
                <Button onClick={handleSend} disabled={sending || !content.trim()} size="icon" className="shrink-0 h-10 w-10">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
