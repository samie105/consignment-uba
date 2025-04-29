"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 z-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-md" />

      <Sun className={cn("h-5 w-5 transition-all", theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100")} />

      <Moon
        className={cn(
          "absolute h-5 w-5 transition-all",
          theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
