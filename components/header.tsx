"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Menu, Search, Moon, Sun, Laptop, Settings, Box } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query" // Updated import path
import { useThemeContext } from "@/lib/theme-provider"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { scrollToSection } from "@/lib/scroll-utils"
import Cookies from "js-cookie"
import Image from "next/image"
import logo from "@/public/logo.svg"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [tracking_number, settracking_number] = useState("")
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false)
  const { colorPalette, setColorPalette } = useThemeContext()
  const [activeSection, setActiveSection] = useState<string>("")
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { theme, setTheme } = useTheme()
  const scrollListenerRef = useRef<number | null>(null)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#shipping", label: "Ship" },
    { href: "#sponsors", label: "Sponsors" },
    { href: "#contact", label: "Contact" },
    { href: "#faq", label: "FAQ" },
  ]

  // Close menu when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false)
    }
  }, [isMobile])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMenuOpen && !target.closest("nav") && !target.closest("button")) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMenuOpen])

  // Scroll spy functionality
  useEffect(() => {
    // Only run on the homepage
    if (pathname !== "/") return

    const handleScroll = () => {
      // Get all sections that correspond to nav items
      const sections = navItems
        .filter((item) => item.href.startsWith("#"))
        .map((item) => {
          const id = item.href.substring(1)
          const element = document.getElementById(id)
          if (!element) return null

          const rect = element.getBoundingClientRect()
          // Calculate how much of the section is visible in the viewport
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
          const visiblePercentage = visibleHeight > 0 ? visibleHeight / rect.height : 0

          return {
            id,
            visiblePercentage,
            top: rect.top,
          }
        })
        .filter(Boolean) as Array<{ id: string; visiblePercentage: number; top: number }>

      if (sections.length === 0) return

      // Sort by visibility percentage (descending) and then by proximity to top (ascending)
      sections.sort((a, b) => {
        if (Math.abs(a.visiblePercentage - b.visiblePercentage) > 0.1) {
          return b.visiblePercentage - a.visiblePercentage
        }
        return Math.abs(a.top) - Math.abs(b.top)
      })

      // Set the most visible section as active
      const mostVisibleSection = sections[0]
      if (mostVisibleSection && mostVisibleSection.visiblePercentage > 0.1) {
        setActiveSection(mostVisibleSection.id)
      } else if (window.scrollY < 100) {
        // If at the top of the page, set home as active
        setActiveSection("")
      }
    }

    // Use requestAnimationFrame for better performance
    const loop = () => {
      handleScroll()
      scrollListenerRef.current = requestAnimationFrame(loop)
    }

    // Start the animation frame loop
    scrollListenerRef.current = requestAnimationFrame(loop)

    // Clean up
    return () => {
      if (scrollListenerRef.current) {
        cancelAnimationFrame(scrollListenerRef.current)
      }
    }
  }, [pathname, navItems])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tracking_number.trim()) return

    // Redirect to the tracking page with the tracking number as a query parameter
    window.location.href = `/track?tracking=${encodeURIComponent(tracking_number.trim())}`

    // Close the dialog
    setIsTrackingDialogOpen(false)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load theme from cookie on client side
      const savedTheme = Cookies.get("theme")
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [setTheme])

  const handleColorChange = (color: string) => {
    setColorPalette(color)
  }

  // Color palette options with dark mode variants
  const colorOptions = [
    { name: "green", lightClass: "bg-green-500", darkClass: "bg-green-400" },
    { name: "blue", lightClass: "bg-blue-500", darkClass: "bg-blue-400" },
    { name: "red", lightClass: "bg-red-500", darkClass: "bg-red-400" },
    { name: "orange", lightClass: "bg-orange-500", darkClass: "bg-orange-400" },
    { name: "purple", lightClass: "bg-purple-500", darkClass: "bg-purple-400" },
    { name: "pink", lightClass: "bg-pink-500", darkClass: "bg-pink-400" },
    { name: "teal", lightClass: "bg-teal-500", darkClass: "bg-teal-400" },
    { name: "amber", lightClass: "bg-amber-500", darkClass: "bg-amber-400" },
    { name: "indigo", lightClass: "bg-indigo-500", darkClass: "bg-indigo-400" },
    { name: "cyan", lightClass: "bg-cyan-500", darkClass: "bg-cyan-400" },
  ]

  // Handle navigation link clicks
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links on the homepage
    if (href.startsWith("#") && pathname === "/") {
      const sectionId = href.substring(1)
      scrollToSection(e, sectionId)

      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Box className="siz4-8"/>
          <Link href="/" className="flex items-start">
            <div className="h-10 w-auto flex items-center justify-center relative">
              <svg width="130" height="30" viewBox="0 0 130 30" xmlns="http://www.w3.org/2000/svg">
                <style>
                  {`
                    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500&display=swap');

                    text {
                      font-family: 'Manrope', sans-serif;
                      font-size: 16px;
                      stroke: currentColor;
                      stroke-width: 1;
                      stroke-dasharray: 300;
                      stroke-dashoffset: 300;
                      fill: currentColor;
                      fill-opacity: 0;
                      animation: strokeAnim 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite, fillAnim 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
                      animation-delay: 0s;
                      letter-spacing:3px;
                    }

                    @keyframes strokeAnim {
                      0%   { stroke-dashoffset: 300; }
                      20%  { stroke-dashoffset: 0; }
                      60%  { stroke-dashoffset: 0; }
                      80%  { stroke-dashoffset: 300; }
                      100% { stroke-dashoffset: 300; }
                    }

                    @keyframes fillAnim {
                      0%   { fill-opacity: 0; }
                      20%  { fill-opacity: 0; }
                      25%  { fill-opacity: 0; }
                      60%  { fill-opacity: 1; }
                      65%  { fill-opacity: 0; }
                      100% { fill-opacity: 0; }
                    }
                  `}
                </style>

                <rect width="100" height="30" fill="transparent" />
                
                <text x="5" y="22">TRANSIVIO</text>
              </svg>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-center flex-1">
          {/* Desktop navigation */}
          <nav className="hidden md:flex md:gap-6 justify-center">
            {navItems.map((item, index) => {
              // Check if this nav item is active
              const isActive =
                (item.href === "/" && activeSection === "") ||
                (item.href.startsWith("#") && activeSection === item.href.substring(1))

              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-2 group",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {/* Settings button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Appearance</h4>
                  <p className="text-sm text-muted-foreground">Customize the look and feel of the interface</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme" className="mb-2">
                      Theme
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="flex-1"
                    >
                      <Sun className="mr-1 h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="flex-1"
                    >
                      <Moon className="mr-1 h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                      className="flex-1"
                    >
                      <Laptop className="mr-1 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="color" className="mb-2">
                      Color Palette
                    </Label>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.name}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "p-0 w-8 h-8 rounded-full flex items-center justify-center",
                          colorPalette === color.name && "ring-2 ring-primary",
                        )}
                        onClick={() => handleColorChange(color.name)}
                      >
                        <div
                          className={cn("w-6 h-6 rounded-full", theme === "dark" ? color.darkClass : color.lightClass)}
                        />
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Track Now button */}
          <Link href="/track">
            <Button variant="default" className="hidden md:flex">
              <Search className="mr-2 h-4 w-4" />
              Track Now
            </Button>
          </Link>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center space-x-2">
                    <div className="h-10 w-auto flex items-center justify-center relative">
              <svg width="130" height="30" viewBox="0 0 130 30" xmlns="http://www.w3.org/2000/svg">
                <style>
                  {`
                    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500&display=swap');

                    text {
                      font-family: 'Manrope', sans-serif;
                      font-size: 16px;
                      stroke: currentColor;
                      stroke-width: 1;
                      stroke-dasharray: 300;
                      stroke-dashoffset: 300;
                      fill: currentColor;
                      fill-opacity: 0;
                      animation: strokeAnim 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite, fillAnim 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
                      animation-delay: 0s;
                      letter-spacing:3px;
                    }

                    @keyframes strokeAnim {
                      0%   { stroke-dashoffset: 300; }
                      20%  { stroke-dashoffset: 0; }
                      60%  { stroke-dashoffset: 0; }
                      80%  { stroke-dashoffset: 300; }
                      100% { stroke-dashoffset: 300; }
                    }

                    @keyframes fillAnim {
                      0%   { fill-opacity: 0; }
                      20%  { fill-opacity: 0; }
                      25%  { fill-opacity: 0; }
                      60%  { fill-opacity: 1; }
                      65%  { fill-opacity: 0; }
                      100% { fill-opacity: 0; }
                    }
                  `}
                </style>

                <rect width="100" height="30" fill="transparent" />
                
                <text x="5" y="22">TRANSIVIO</text>
              </svg>
            </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-4rem)]">
                  <div className="py-6 pb-20 px-1">
                    <nav className="flex flex-col gap-4">
                      {navItems.map((item, index) => {
                        // Check if this nav item is active for mobile menu
                        const isActive =
                          (item.href === "/" && activeSection === "") ||
                          (item.href.startsWith("#") && activeSection === item.href.substring(1))

                        return (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={(e) => handleNavLinkClick(e, item.href)}
                            className={cn(
                              "text-sm font-medium transition-colors hover:text-primary relative py-2",
                              isActive ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            {item.label}
                            <span
                              className={cn(
                                "absolute bottom-0 left-0 w-16 h-0.5 bg-primary transform origin-left transition-transform duration-300",
                                isActive ? "scale-x-100" : "scale-x-0",
                              )}
                            />
                          </Link>
                        )
                      })}
                    </nav>

                    <div className="mt-6 space-y-4">
                      <div className="pt-4 border-t">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Appearance</h4>
                          <p className="text-sm text-muted-foreground">Customize the look and feel of the interface</p>
                        </div>
                        <div className="grid gap-3 mt-4">
                          <div className="grid gap-1">
                            <Label htmlFor="theme" className="mb-1 text-sm">
                              Theme
                            </Label>
                            <div className="flex gap-1">
                              <Button
                                variant={theme === "light" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setTheme("light")}
                                className="h-8 w-8"
                              >
                                <Sun className="h-4 w-4" />
                                <span className="sr-only">Light</span>
                              </Button>
                              <Button
                                variant={theme === "dark" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setTheme("dark")}
                                className="h-8 w-8"
                              >
                                <Moon className="h-4 w-4" />
                                <span className="sr-only">Dark</span>
                              </Button>
                              <Button
                                variant={theme === "system" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setTheme("system")}
                                className="h-8 w-8"
                              >
                                <Laptop className="h-4 w-4" />
                                <span className="sr-only">System</span>
                              </Button>
                            </div>
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor="color" className="mb-1 text-sm">
                              Color Palette
                            </Label>
                            <div className="grid grid-cols-5 gap-1">
                              {colorOptions.map((color) => (
                                <Button
                                  key={color.name}
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    "p-0 w-7 h-7 rounded-full flex items-center justify-center",
                                    colorPalette === color.name && "ring-2 ring-primary",
                                  )}
                                  onClick={() => handleColorChange(color.name)}
                                >
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full",
                                      theme === "dark" ? color.darkClass : color.lightClass,
                                    )}
                                  />
                                  <span className="sr-only">{color.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
