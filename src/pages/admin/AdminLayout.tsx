import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { Package, LayoutDashboard, MessageSquare, LogOut, Users, TrendingUp, Newspaper } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/requests", label: "Demandes", icon: Package },
  { path: "/admin/clients", label: "Clients", icon: Users },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/trending", label: "Nouveautés", icon: TrendingUp },
  { path: "/admin/news", label: "Actualités", icon: Newspaper },
]

export default function AdminLayout() {
  const location = useLocation()
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r bg-card shrink-0">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-primary">HST</span> Admin
            </span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t space-y-2">
          <div className="text-xs text-muted-foreground px-3 truncate">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
