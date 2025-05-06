import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Your Package | DeliveryUno",
  description: "Track your package and get real-time updates on its location and delivery status.",
}

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}