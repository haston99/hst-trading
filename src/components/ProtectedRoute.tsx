import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { auth } from "@/lib/insforge"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const location = useLocation()

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
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
