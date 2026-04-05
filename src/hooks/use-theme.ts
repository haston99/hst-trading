import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
    } else {
      root.classList.remove("light", "dark")
      root.classList.add(theme)
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return { theme, setTheme, toggleTheme }
}
