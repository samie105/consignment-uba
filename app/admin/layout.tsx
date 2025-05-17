import type React from "react"
import type { Metadata } from "next"
import AdminSidebar from "@/components/admin/sidebar"
import { getSession } from "@/server/actions/authActions"
import { redirect } from "next/navigation"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Admin Dashboard | Greenroute Delivery",
  description: "Manage your delivery operations with Greenroute Delivery admin dashboard",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        <AdminSidebar user={session} />
        <main className="flex-1 overflow-x-hidden pl-[70px]">
          <div className="container mx-auto py-6 px-4">{children}</div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  )
}
