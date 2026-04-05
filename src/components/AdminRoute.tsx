import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { auth } from "@/lib/insforge"
import { Loader2 } from "lucide-react"

const ADMIN_EMAIL = "thabaron222@gmail.com"

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data } = await auth.getCurrentUser()
      if (data?.user) {
        setUser({ email: data.user.email })
      }
    } catch (err) {
      console.error("Auth error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return <Navigate to="/portal" replace />
  }

  return <>{children}</>
}
