"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, Settings, Home, Menu, X, LogOut, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { logout } from "@/server/actions/authActions"
import { toast } from "sonner"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: {
    id: string
    name: string
    email: string
    role: string
  } | null
}

export default function AdminSidebar({ className, user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: "Packages",
      icon: Package,
      href: "/admin/packages",
      active: pathname?.includes("/admin/packages") && !pathname?.includes("/admin/packages/create"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname?.includes("/admin/settings"),
    },
  ]

  const handleLogout = async () => {
    toast.info("Logging out...")
    await logout()
    // No need to redirect here as the server action will handle it
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex h-full flex-col bg-background border-r",
          isOpen ? "w-64" : "w-[70px] items-center",
          className,
        )}
      >
        <div className={cn("flex h-16 items-center border-b px-4", isOpen ? "justify-between" : "justify-center")}>
          {isOpen ? (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="font-bold">Greenroute Delivery</span>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="flex items-center justify-center">
             
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className={cn("h-8 w-8 p-0", !isOpen && "mt-4")}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-2 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  !isOpen && "justify-center px-3",
                )}
              >
                <route.icon className={cn("h-5 w-5", route.active && "text-primary")} />
                {isOpen && <span>{route.label}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        {/* User section */}
        <div className={cn("border-t p-4", !isOpen && "flex flex-col items-center")}>
          {isOpen && user && (
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size={isOpen ? "default" : "icon"}
            onClick={handleLogout}
            className={cn("w-full", !isOpen && "h-9 w-9")}
          >
            <LogOut className={cn("h-4 w-4", isOpen && "mr-2")} />
            {isOpen && "Logout"}
          </Button>
        </div>
      </div>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
