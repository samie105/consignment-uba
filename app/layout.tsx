import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { ThemeProvider } from "@/lib/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { initializeStorage } from "@/server/actions/storageActions"

// Initialize Manrope font
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "DeliveryUno - Your Trusted Delivery Partner",
  description: "Fast, reliable package delivery services for businesses and individuals.",
    generator: 'v0.dev'
}

// Initialize storage bucket without blocking rendering
initializeStorage().catch((error) => {
  console.error("Storage initialization error (non-blocking):", error)
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
