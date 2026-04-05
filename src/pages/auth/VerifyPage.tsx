import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, Loader2, Mail } from "lucide-react"
import { auth } from "@/lib/insforge"
import { toast } from "sonner"

export default function VerifyPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || ""
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !code) return
    
    setLoading(true)
    try {
      const { data: verifyData, error } = await auth.verifyEmail({ email, otp: code })
      if (error) {
        toast.error(error.message)
        return
      }
      if (verifyData?.user) {
        setSuccess(true)
        toast.success("Email vérifié ! Vous pouvez maintenant vous connecter.")
      }
    } catch (err) {
      toast.error("Code invalide")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!email) return
    setLoading(true)
    try {
      const { error } = await auth.resendVerificationEmail({ email })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Code renvoyé !")
    } catch (err) {
      toast.error("Erreur lors du renvoi")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Email vérifié !</h2>
            <p className="text-muted-foreground mb-6">
              Votre compte a été vérifié avec succès.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth/login">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">
              <span className="text-primary">HST</span>
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Vérifiez votre email</CardTitle>
            <CardDescription>
              Entrez le code à 6 chiffres envoyé à<br />
              <span className="font-medium text-foreground">{email || "votre email"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Vérifier
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-primary hover:underline disabled:opacity-50"
              >
                Renvoyer le code
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
