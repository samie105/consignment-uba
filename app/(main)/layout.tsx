import type React from "react"
// Remove Header import
// import Header from "@/components/header"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Remove Header component */}
      <main className="min-h-screen">{children}</main>
    </>
  )
}
