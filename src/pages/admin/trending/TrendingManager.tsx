import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react"
import { trendingProductsApi } from "@/lib/api"
import type { TrendingProduct } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function TrendingManager() {
  const [products, setProducts] = useState<TrendingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    image_url_2: "",
    image_url_3: "",
    image_url_4: "",
    category: ""
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await trendingProductsApi.getAll()
      setProducts(data)
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors du chargement des produits")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await trendingProductsApi.update(editingId, formData)
        toast.success("Produit mis à jour")
      } else {
        await trendingProductsApi.create({
          ...formData,
          display_order: products.length
        })
        toast.success("Produit ajouté")
      }
      setFormData({ name: "", description: "", image_url: "", image_url_2: "", image_url_3: "", image_url_4: "", category: "" })
      setShowForm(false)
      setEditingId(null)
      loadProducts()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'enregistrement")
    }
  }

  const handleEdit = (product: TrendingProduct) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      image_url: product.image_url || "",
      image_url_2: product.image_url_2 || "",
      image_url_3: product.image_url_3 || "",
      image_url_4: product.image_url_4 || "",
      category: product.category || ""
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return
    try {
      await trendingProductsApi.delete(id)
      toast.success("Produit supprimé")
      loadProducts()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleToggleActive = async (product: TrendingProduct) => {
    try {
      await trendingProductsApi.update(product.id, { is_active: !product.is_active })
      loadProducts()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const moveUp = async (index: number) => {
    if (index === 0) return
    const newProducts = [...products]
    const temp = newProducts[index].display_order
    newProducts[index].display_order = newProducts[index - 1].display_order
    newProducts[index - 1].display_order = temp
    await trendingProductsApi.reorder([
      { id: newProducts[index].id, display_order: newProducts[index].display_order },
      { id: newProducts[index - 1].id, display_order: newProducts[index - 1].display_order }
    ])
    loadProducts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nouveautés</h1>
          <p className="text-muted-foreground">Gérez les nouveaux produits à présenter aux clients</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", description: "", image_url: "", image_url_2: "", image_url_3: "", image_url_4: "", category: "" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier le produit" : "Nouveau produit"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nom du produit *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: iPhone 15 Pro Max"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Electronique"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Image principale URL</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://... (obligatoire)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image 2 URL</label>
                  <Input
                    value={formData.image_url_2}
                    onChange={(e) => setFormData({ ...formData, image_url_2: e.target.value })}
                    placeholder="https://... (optionnel)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image 3 URL</label>
                  <Input
                    value={formData.image_url_3}
                    onChange={(e) => setFormData({ ...formData, image_url_3: e.target.value })}
                    placeholder="https://... (optionnel)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image 4 URL</label>
                  <Input
                    value={formData.image_url_4}
                    onChange={(e) => setFormData({ ...formData, image_url_4: e.target.value })}
                    placeholder="https://... (optionnel)"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description courte..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Mettre à jour" : "Ajouter"}</Button>
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
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun produit tendance. Cliquez sur "Ajouter un produit" pour commencer.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Card key={product.id} className={!product.is_active ? "opacity-50" : ""}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`text-xs px-2 py-0.5 rounded ${product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {product.is_active ? "Actif" : "Inactif"}
                      </button>
                    </div>
                    {product.category && (
                      <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                    )}
                    {product.image_url ? (
                      <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-muted">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="mt-2 aspect-video rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    {product.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        Modifier
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
