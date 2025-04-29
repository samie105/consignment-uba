"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Default to true on server to avoid layout shift
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(query)

      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      // Set initial value
      setMatches(mediaQuery.matches)

      // Setup listener using the newer API
      try {
        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
      } catch (e) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }

    return undefined
  }, [query])

  return matches
}
