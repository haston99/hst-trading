import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { ChevronLeft, CheckCircle2, Circle, Send, Loader2, Image } from "lucide-react"
import { toast } from "sonner"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { requestsApi, messagesApi, quotesApi, type Request, type Message, type Quote } from "@/lib/api"
import { realtime } from "@/lib/insforge"

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

function TrackingTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status)

  return (
    <div className="hidden sm:flex items-start gap-0">
      {STATUS_STEPS.map((step, i) => {
        const isDone = i <= currentIndex
        const isCurrent = i === currentIndex
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {i > 0 && <div className={cn("flex-1 h-0.5 transition-colors", isDone ? "bg-primary" : "bg-border")} />}
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all shrink-0", isCurrent ? "border-primary bg-primary text-primary-foreground scale-110" : isDone ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground")}>
                {isDone && !isCurrent ? <CheckCircle2 className="w-4 h-4 fill-primary text-primary-foreground" /> : isCurrent ? <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" /> : <Circle className="w-3.5 h-3.5" />}
              </div>
              {i < STATUS_STEPS.length - 1 && <div className={cn("flex-1 h-0.5 transition-colors", i < currentIndex ? "bg-primary" : "bg-border")} />}
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

export default function RequestDetail() {
  const { requestId } = useParams<{ requestId: string }>()
  const [request, setRequest] = useState<Request | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [content, setContent] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
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
      const [reqData, msgsData, quotesData] = await Promise.all([
        requestsApi.getById(requestId!),
        messagesApi.getByRequestId(requestId!),
        quotesApi.getByRequestId(requestId!)
      ])
      setRequest(reqData)
      setMessages(msgsData)
      setQuotes(quotesData)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
    } catch (err) {
      console.error("Failed to load request:", err)
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuote = async (quoteId: string) => {
    setActionLoading(true)
    try {
      await quotesApi.acceptQuote(quoteId, requestId!)
      toast.success("Devis accepté !")
      loadData()
    } catch (err) {
      console.error("Failed to accept quote:", err)
      toast.error("Erreur lors de l'acceptation")
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectQuote = async (quoteId: string) => {
    setActionLoading(true)
    try {
      await quotesApi.rejectQuote(quoteId)
      toast.success("Devis refusé")
      loadData()
    } catch (err) {
      console.error("Failed to reject quote:", err)
      toast.error("Erreur lors du refus")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSend = async () => {
    if (!content.trim() || !requestId) return
    setSending(true)
    try {
      const newMsg = await messagesApi.create({
        request_id: requestId,
        content: content.trim(),
        sender_role: "user",
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
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="font-semibold mb-2">Demande non trouvée</h3>
            <Button asChild>
              <Link to="/portal">Retour au tableau de bord</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = statusLabels[request.status] || { label: request.status, className: "" }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <Link to="/portal" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" />
        Retour au tableau de bord
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
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-5">Suivi de la commande</h2>
        <TrackingTimeline status={request.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Détails de la demande</h2>
              <dl className="space-y-3">
                {[
                  { label: "Catégorie", value: request.category },
                  { label: "Quantité", value: `${request.quantity} unités` },
                  { label: "Budget unitaire max", value: request.budget_per_unit ? `${request.budget_per_unit} ${request.currency}` : "Non spécifié" },
                  { label: "Prix devisé", value: request.quoted_price ? `${request.quoted_price} ${request.currency}/unité` : "En attente" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {quotes.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Devis proposés</h2>
                <div className="space-y-3">
                  {quotes.filter(q => q.status === "pending").map((quote) => (
                    <div key={quote.id} className="p-4 border rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-lg font-bold">{quote.price_per_unit.toLocaleString()} XOF/unit</div>
                          <div className="text-sm text-muted-foreground">
                            Total: {(quote.price_per_unit * request.quantity).toLocaleString()} XOF
                          </div>
                        </div>
                      </div>
                      {quote.notes && (
                        <p className="text-sm text-muted-foreground mb-4">{quote.notes}</p>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={() => handleAcceptQuote(quote.id)} disabled={actionLoading} className="flex-1">
                          Accepter le devis
                        </Button>
                        <Button variant="outline" onClick={() => handleRejectQuote(quote.id)} disabled={actionLoading}>
                          Refuser
                        </Button>
                      </div>
                    </div>
                  ))}
                  {quotes.filter(q => q.status !== "pending").map((quote) => (
                    <div key={quote.id} className="p-4 border rounded-xl opacity-60">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{quote.price_per_unit.toLocaleString()} XOF/unit</div>
                          <div className="text-sm text-muted-foreground">
                            Total: {(quote.price_per_unit * request.quantity).toLocaleString()} XOF
                          </div>
                        </div>
                        <Badge variant={quote.status === "accepted" ? "default" : "destructive"}>
                          {quote.status === "accepted" ? "Accepté" : "Refusé"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {request.image_url && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Images</h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[request.image_url || undefined, request.image_url_2 || undefined, request.image_url_3 || undefined, request.image_url_4 || undefined].filter((url): url is string => !!url).map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <img src={url} alt={`Image ${idx + 1}`} className="w-32 h-32 object-cover rounded-lg border hover:opacity-90 transition-opacity" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Aucun message. Envoyez un message pour commencer.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_role === "user"
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5", isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm")}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        {msg.image_url && (
                          <a href={msg.image_url} target="_blank" rel="noopener noreferrer" className="block mt-2">
                            <img src={msg.image_url} alt="Image jointe" className="w-32 h-32 object-cover rounded-lg border" />
                          </a>
                        )}
                        <div className={cn("text-[10px] mt-1 opacity-60", isMe ? "text-right" : "text-left")}>
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
                <Textarea value={content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} placeholder="Écrivez votre message..." rows={2} className="resize-none" />
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
