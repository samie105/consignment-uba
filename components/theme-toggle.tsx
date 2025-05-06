"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Palette } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useThemeContext } from "@/lib/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { colorPalette, setColorPalette } = useThemeContext()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  const colorOptions = [
    { name: "Green", value: "green" },
    { name: "Blue", value: "blue" },
    { name: "Red", value: "red" },
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
    { name: "Pink", value: "pink" },
    { name: "Teal", value: "teal" },
    { name: "Amber", value: "amber" },
    { name: "Indigo", value: "indigo" },
    { name: "Cyan", value: "cyan" },
  ]

  return (
    <div className="flex items-center gap-2">
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative overflow-hidden group">
            <div className="absolute inset-0 z-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-md" />
            <Palette className="h-5 w-5" />
            <span className="sr-only">Change color theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex items-center justify-between" onClick={() => {}}>
            <span>Current: {colorOptions.find(c => c.value === colorPalette)?.name || 'Green'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {colorOptions.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={() => setColorPalette(color.value)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                colorPalette === color.value && "font-medium"
              )}
            >
              <div 
                className={`w-4 h-4 rounded-full`} 
                style={{ 
                  backgroundColor: `hsl(${
                    color.value === 'green' ? '142' :
                    color.value === 'blue' ? '221' :
                    color.value === 'red' ? '0' :
                    color.value === 'purple' ? '270' :
                    color.value === 'orange' ? '24' :
                    color.value === 'pink' ? '330' :
                    color.value === 'teal' ? '180' :
                    color.value === 'amber' ? '45' :
                    color.value === 'indigo' ? '245' : 
                    '195' // cyan
                  }, 47.4%, 50.2%)` 
                }}
              />
              {color.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
