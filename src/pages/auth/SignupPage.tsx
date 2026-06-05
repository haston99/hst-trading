import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, Loader2, Eye, EyeOff, Mail, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { auth } from "@/lib/insforge"
import { toast } from "sonner"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"signup" | "verify" | "success">("signup")
  const [code, setCode] = useState("")
  const { signUp, refreshUser } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { requiresVerification } = await signUp(email, password, name)
      if (requiresVerification) {
        setStep("verify")
      } else {
        navigate("/portal")
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !code) return
    setLoading(true)
    try {
      const { data, error } = await auth.verifyEmail({ email, otp: code })
      if (error) {
        toast.error(error.message)
        return
      }
      if (data?.user) {
        await refreshUser()
        setStep("success")
        toast.success("Email vérifié !")
        setTimeout(() => navigate("/portal"), 1500)
      }
    } catch {
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
    } catch {
      toast.error("Erreur lors du renvoi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Inscription - HST Trading</title>
        <meta name="description" content="Créez votre compte HST Trading pour importer vos produits de Chine en toute simplicité." />
        <meta property="og:title" content="Inscription - HST Trading" />
        <link rel="canonical" href="https://hst-trading.vercel.app/auth/signup" />
      </Helmet>
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

        {step === "success" ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Compte vérifié !</h2>
              <p className="text-muted-foreground">Redirection vers votre espace client...</p>
            </CardContent>
          </Card>
        ) : step === "verify" ? (
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Vérifiez votre email</CardTitle>
              <CardDescription>
                Un code à 6 chiffres a été envoyé à<br />
                <span className="font-medium text-foreground">{email}</span>
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
              <div className="mt-4 text-center text-sm">
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
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Créer un compte</CardTitle>
              <CardDescription>Rejoignez HST Trading</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Créer mon compte
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Déjà un compte ? </span>
                <Link to="/auth/login" className="text-primary hover:underline font-medium">
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
