import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Edit, Package, Truck, TrendingUp } from "lucide-react"
import { newsPostsApi } from "@/lib/api"
import type { NewsPost } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const categoryLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  new_arrivals: { label: "Nouveautés", icon: Package, color: "bg-blue-100 text-blue-700" },
  shipping: { label: "Expédition", icon: Truck, color: "bg-orange-100 text-orange-700" },
  market: { label: "Marché", icon: TrendingUp, color: "bg-green-100 text-green-700" }
}

export default function NewsManager() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "new_arrivals" as "new_arrivals" | "shipping" | "market"
  })

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await newsPostsApi.getAll()
      setPosts(data)
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors du chargement des nouvelles")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await newsPostsApi.update(editingId, formData)
        toast.success("Publication mise à jour")
      } else {
        await newsPostsApi.create(formData)
        toast.success("Publication ajoutée")
      }
      setFormData({ title: "", content: "", category: "new_arrivals" })
      setShowForm(false)
      setEditingId(null)
      loadPosts()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'enregistrement")
    }
  }

  const handleEdit = (post: NewsPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette publication ?")) return
    try {
      await newsPostsApi.delete(id)
      toast.success("Publication supprimée")
      loadPosts()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleToggleActive = async (post: NewsPost) => {
    try {
      await newsPostsApi.update(post.id, { is_active: !post.is_active })
      loadPosts()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Actualités</h1>
          <p className="text-muted-foreground">Publiez des nouvelles pour vos clients</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: "", content: "", category: "new_arrivals" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle publication
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier la publication" : "Nouvelle publication"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titre *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Nouveaux produits Apple disponibles"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="new_arrivals">Nouveautés</option>
                  <option value="shipping">Expédition</option>
                  <option value="market">Marché</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Contenu *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu de la publication..."
                  rows={5}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Mettre à jour" : "Publier"}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null) }}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Chargement...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune publication. Cliquez sur "Nouvelle publication" pour commencer.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const cat = categoryLabels[post.category]
            const Icon = cat?.icon || Package
            return (
              <Card key={post.id} className={!post.is_active ? "opacity-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${cat?.color}`}>
                          <Icon className="w-3 h-3 inline mr-1" />
                          {cat?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
                        <button
                          onClick={() => handleToggleActive(post)}
                          className={`text-xs px-2 py-0.5 rounded ${post.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {post.is_active ? "Actif" : "Inactif"}
                        </button>
                      </div>
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
