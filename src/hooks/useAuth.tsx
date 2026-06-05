import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { auth } from "@/lib/insforge"
import { toast } from "sonner"

const ADMIN_EMAIL = "thabaron222@gmail.com"

interface User {
  id: string
  email: string
  emailVerified: boolean
  profile: {
    name?: string
    avatar_url?: string
  }
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data } = await auth.getCurrentUser()
      if (data?.user) {
        setUser(data.user as User)
      }
    } catch (err) {
      console.error("Auth error:", err)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      throw error
    }
    if (data?.user) {
      setUser(data.user as User)
      toast.success("Connexion réussie !")
    }
  }

  async function signUp(email: string, password: string, name?: string) {
    const { data, error } = await auth.signUp({ email, password, name })
    if (error) {
      toast.error(error.message)
      throw error
    }
    if (data?.user) {
      setUser(data.user as User)
      toast.success("Compte créé avec succès !")
    } else if (data?.requireEmailVerification) {
      const { data: signInData, error: signInError } = await auth.signInWithPassword({ email, password })
      if (signInError) {
        toast.error("Erreur lors de la connexion automatique. Veuillez vous connecter.")
        throw signInError
      }
      if (signInData?.user) {
        setUser(signInData.user as User)
        toast.success("Compte créé avec succès !")
      }
    }
  }

  async function refreshUser() {
    try {
      const { data } = await auth.getCurrentUser()
      if (data?.user) {
        setUser(data.user as User)
      }
    } catch (err) {
      console.error("Refresh user error:", err)
    }
  }

  async function signOut() {
    await auth.signOut()
    setUser(null)
    toast.success("Déconnexion réussie")
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
