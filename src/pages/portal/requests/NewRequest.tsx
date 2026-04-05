import { useState, useEffect } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { requestsApi } from "@/lib/api"

const CATEGORIES = [
  "Électronique & High-Tech",
  "Textile & Mode",
  "Matériaux de construction",
  "Cosmétiques & Beauté",
  "Équipements industriels",
  "Alimentation & Épicerie",
  "Jouets & Articles enfants",
  "Mobilier & Décoration",
  "Autre",
]

export default function NewRequest() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
    budgetPerUnit: "",
    currency: "EUR",
  })

  const images = [
    searchParams.get("image"),
    searchParams.get("image_2"),
    searchParams.get("image_3"),
    searchParams.get("image_4"),
  ].filter(Boolean) as string[]

  const isFromTrending = images.length > 0

  useEffect(() => {
    const productName = searchParams.get("product")
    const category = searchParams.get("category")
    const description = searchParams.get("description")
    const price = searchParams.get("price")

    if (productName) {
      setForm((prev) => ({
        ...prev,
        title: productName,
        category: category || prev.category,
        description: description || prev.description,
        budgetPerUnit: price || prev.budgetPerUnit,
      }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.category || !form.quantity) {
      toast.error("Veuillez remplir tous les champs obligatoires.")
      return
    }
    const qty = parseInt(form.quantity)
    if (isNaN(qty) || qty <= 0) {
      toast.error("La quantité doit être un nombre positif.")
      return
    }

    setIsSubmitting(true)
    try {
      const request = await requestsApi.create({
        title: form.title,
        description: form.description,
        category: form.category,
        quantity: qty,
        budget_per_unit: form.budgetPerUnit ? parseFloat(form.budgetPerUnit) : undefined,
        currency: form.currency,
      })
      toast.success("Demande créée avec succès !")
      navigate(`/portal/requests/${request.id}`)
    } catch (err) {
      console.error("Failed to create request:", err)
      toast.error("Erreur lors de la création. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <Link
        to="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour au tableau de bord
      </Link>

      <h1 className="text-2xl font-bold mb-2">Nouvelle demande de sourcing</h1>
      <p className="text-muted-foreground mb-8">
        {isFromTrending
          ? "Vous avez sélectionné un produit tendance. Consultez les images ci-dessous et complétez votre demande."
          : "Décrivez le produit que vous recherchez. Notre équipe vous répondra avec un devis sous 24h."}
      </p>

      {isFromTrending && images.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">Images du produit</h3>
          <div className="space-y-3">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
              <img
                src={images[selectedImageIndex]}
                alt={`Produit ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      idx === selectedImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`Vue ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              {selectedImageIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la demande *</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ex: Chaussures de sport pour hommes"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie *</Label>
          <Select
            value={form.category}
            onValueChange={(val: string) => setForm((p) => ({ ...p, category: val }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description détaillée *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Décrivez précisément le produit : dimensions, matériaux, couleurs, spécifications techniques..."
            rows={5}
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              placeholder="500"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budgetPerUnit">Budget unitaire max</Label>
            <Input
              id="budgetPerUnit"
              name="budgetPerUnit"
              type="number"
              step="0.01"
              min="0"
              placeholder="8.00"
              value={form.budgetPerUnit}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Select
              value={form.currency}
              onValueChange={(val: string) => setForm((p) => ({ ...p, currency: val }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR €</SelectItem>
                <SelectItem value="USD">USD $</SelectItem>
                <SelectItem value="XOF">XOF CFA</SelectItem>
                <SelectItem value="CNY">CNY ¥</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link to="/portal">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
