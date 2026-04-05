import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Clock, ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { requestsApi, messagesApi, type Request, type Message } from "@/lib/api"

interface MessageWithRequest extends Message {
  request?: Request
}

function formatDistanceToNow(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins < 60) return `il y a ${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `il y a ${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 0) return "aujourd'hui"
  if (diffDays === 1) return "hier"
  return `il y a ${diffDays} jours`
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<MessageWithRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    try {
      setLoading(true)
      const requests = await requestsApi.getAll()
      const allMessages: MessageWithRequest[] = []
      
      for (const req of requests) {
        const msgs = await messagesApi.getByRequestId(req.id)
        msgs.forEach(msg => {
          allMessages.push({ ...msg, request: req })
        })
      }
      
      allMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setMessages(allMessages)
    } catch (err) {
      console.error("Failed to load messages:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-20 bg-muted rounded-xl"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">Tous les messages des clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages récents ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun message</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={`/admin/requests/${msg.request_id}`}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      msg.sender_role === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={msg.sender_role === "admin" ? "bg-primary/10" : "bg-blue-50"}>
                          {msg.sender_role === "admin" ? "HST" : "Client"}
                        </Badge>
                        {msg.request && (
                          <span className="text-sm font-medium truncate">{msg.request.title}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(msg.created_at)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
