import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { initializeStorage } from "@/server/actions/storageActions"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "./providers"
import { headers } from 'next/headers'

// Initialize Manrope font
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeliveryUno - Your Trusted Delivery Partner",
  description: "Fast, reliable package delivery services for businesses and individuals.",
  generator: 'v0.dev'
}

// Initialize storage bucket without blocking rendering
initializeStorage().catch((error) => {
  console.error("Storage initialization error (non-blocking):", error)
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const isAdminRoute =  headersList.get('x-is-admin-route') === 'true'

  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            {!isAdminRoute && <Header />}
            <main className="flex-1">{children}</main>
            {!isAdminRoute && <Footer />}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
