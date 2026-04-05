import { Outlet, Link } from "react-router-dom"
import { Package, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export default function PortalLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-primary">HST</span> Portal
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-1" />
              Déconnexion
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">← Retour au site</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </div>
    </div>
  )
}
