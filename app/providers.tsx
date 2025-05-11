"use client"

import type React from "react"

import { ThemeProvider } from "@/lib/theme-provider"
import { Toaster } from "sonner"
import { CheckpointsProvider } from "@/contexts/checkpoints-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CheckpointsProvider>
        {children}
        <Toaster position="top-right" richColors />
      </CheckpointsProvider>
    </ThemeProvider>
  )
}
