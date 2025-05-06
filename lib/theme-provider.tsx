"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Cookies from "js-cookie"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: string
  setTheme: (theme: string) => void
  colorPalette: string
  setColorPalette: (color: string) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorPalette: "green",
  setColorPalette: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [colorPalette, setColorPaletteState] = useState<string>("green")
  const [theme, setThemeState] = useState<string>("system")

  // Load color palette and theme from cookies on mount
  useEffect(() => {
    const savedColorPalette = Cookies.get("colorPalette")
    const savedTheme = Cookies.get("theme")
    
    if (savedColorPalette) {
      setColorPaletteState(savedColorPalette)
      applyColorPalette(savedColorPalette)
    } else {
      applyColorPalette("green")
    }

    if (savedTheme) {
      setThemeState(savedTheme)
    }
  }, [])

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme)
    Cookies.set("theme", newTheme, { expires: 365 })
  }

  const setColorPalette = (color: string) => {
    setColorPaletteState(color)
    Cookies.set("colorPalette", color, { expires: 365 })
    applyColorPalette(color)
  }

  // Apply color palette to CSS variables
  const applyColorPalette = (color: string) => {
    const colorHues: Record<string, string> = {
      blue: "221",
      red: "0",
      green: "142",
      orange: "24",
      purple: "270",
      pink: "330",
      teal: "180",
      amber: "45",
      indigo: "245",
      cyan: "195",
    }

    // Set the primary hue CSS variable
    const hue = colorHues[color] || "142" // Default to green
    document.documentElement.style.setProperty("--primary-hue", hue)

    // Calculate RGB values for the primary color
    const h = Number(hue) / 360
    const s = 47.4 / 100
    const l = document.documentElement.classList.contains("dark") ? 55 / 100 : 50.2 / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const rgb = `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`
    document.documentElement.style.setProperty("--primary-rgb", rgb)

    // Force update CSS custom properties for dark/light mode
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.style.setProperty("--primary", `var(--primary-hue) 47.4% 55%`)
    } else {
      document.documentElement.style.setProperty("--primary", `var(--primary-hue) 47.4% 50.2%`)
    }
  }

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
        colorPalette,
        setColorPalette,
      }}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        forcedTheme={undefined}
      >
        {children}
      </NextThemesProvider>
    </ThemeProviderContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeProviderContext)
