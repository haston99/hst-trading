import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Non Trouvée</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          La page que vous recherchez n'existe pas.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
