import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, Package, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "Pourquoi nous", href: "#why-us" },
  { label: "Nouveautés", href: "/trends" },
  { label: "Actualités", href: "/news" },
  { label: "Contact", href: "#contact" },
]

const ADMIN_EMAIL = "thabaron222@gmail.com"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const isPageLink = (href: string) => href.startsWith("/")
  const isHomePage = location.pathname === "/"

  const handleAnchorClick = (href: string) => {
    setIsOpen(false)
    if (isHomePage) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate(`/${href}`)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[oklch(0.22_0_0)] to-[oklch(0.18_0_0)] border-b border-[oklch(0.28_0_0)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-primary">HST</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            isPageLink(link.href) ? (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm transition-colors font-medium ${
                  location.pathname === link.href
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.href}
                onClick={() => handleAnchorClick(link.href)}
                className="text-sm text-white/70 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </button>
            )
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAdmin ? (
            <Button variant="ghost" size="sm" asChild className="text-white hover:text-white hover:bg-white/10">
              <Link to="/admin" className="gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white">
              <Link to="/auth/login" className="gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                Espace client
              </Link>
            </Button>
          )}
          <Button onClick={() => handleAnchorClick("#contact")} size="sm">
            Demander un devis
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[oklch(0.28_0_0)] bg-gradient-to-b from-[oklch(0.22_0_0)] to-[oklch(0.18_0_0)] px-6 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              isPageLink(link.href) ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left text-sm transition-colors py-2 ${
                    location.pathname === link.href
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleAnchorClick(link.href)}
                  className="block w-full text-left text-sm text-white/70 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </button>
              )
            ))}
            {isAdmin ? (
              <Button asChild size="sm" className="w-full mt-2 bg-white text-black hover:bg-white/90">
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="w-full mt-2 bg-white text-black hover:bg-white/90">
                <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Espace client
                </Link>
              </Button>
            )}
            <Button
              onClick={() => handleAnchorClick("#contact")}
              size="sm"
              className="w-full"
            >
              Demander un devis
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
