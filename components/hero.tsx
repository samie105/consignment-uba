"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Package, Truck, Plane, Ship, Clock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { TextReveal, Meteors } from "@/lib/aceternity-ui"
import { useTheme } from "next-themes"

export default function Hero() {
  const [tracking_number, settracking_number] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { theme } = useTheme()

  const slides = [
    {
      title: "Fast, Reliable Delivery Solutions",
      description:
        "Your trusted partner for global shipping and logistics. We deliver your packages safely and on time, every time.",
    },
    {
      title: "Global Reach, Local Touch",
      description:
        "With our extensive network, we connect businesses and individuals across the world with personalized service.",
    },
    {
      title: "Innovative Logistics Technology",
      description: "Leveraging cutting-edge technology to provide real-time tracking and efficient delivery solutions.",
    },
  ]

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tracking_number.trim()) return

    // Redirect to the tracking page with the tracking number as a query parameter
    window.location.href = `/track?tracking=${encodeURIComponent(tracking_number.trim())}`

    // Close the dialog
    setIsDialogOpen(false)
  }

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  // Set loaded state for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-10"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KAHwudag9pfQiGYlJkVPtzwdQZ3TdN.png')",
        }}
      />

      {/* Dark black overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />

      {/* Spotlight effect */}

      {/* Meteors animation */}
      <Meteors number={15} className="opacity-30 pointer-events-none z-10" />

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <Package className="absolute h-10 w-10 text-white/20 animate-float1" style={{ top: "15%", left: "10%" }} />
        <Truck className="absolute h-12 w-12 text-white/30 animate-float2" style={{ top: "60%", left: "15%" }} />
        <Plane className="absolute h-10 w-10 text-white/25 animate-float3" style={{ top: "25%", right: "15%" }} />
        <Ship className="absolute h-14 w-14 text-white/20 animate-float4" style={{ bottom: "20%", right: "10%" }} />
        <Clock className="absolute h-8 w-8 text-white/30 animate-float5" style={{ top: "40%", left: "50%" }} />
        <Package className="absolute h-6 w-6 text-white/20 animate-float6" style={{ bottom: "30%", left: "30%" }} />
      </div>

      <div className="container relative z-20 h-full flex flex-col justify-center px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_1fr]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={cn(
                    "transition-all duration-700 ease-in-out",
                    index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 absolute pointer-events-none",
                    isLoaded && index === 0 && currentSlide === 0 ? "animate-fadeIn" : "",
                  )}
                >
                  <TextReveal
                    className={cn(
                      "text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white drop-shadow-md",
                      index !== currentSlide && "opacity-0",
                    )}
                  >
                    {slide.title}
                  </TextReveal>
                  <TextReveal
                    className={cn(
                      "max-w-[600px] text-white/90 md:text-xl mt-4 drop-shadow",
                      index !== currentSlide && "opacity-0",
                    )}
                  >
                    {slide.description}
                  </TextReveal>
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-2 sm:gap-4">
              <Link
                href="/track"
                className={cn(
                  "inline-flex h-10 items-center justify-center border-none bg-primary text-white rounded-md px-8 text-sm font-medium",
                  isLoaded ? "animate-slideInFromBottom delay-500" : "opacity-0",
                )}
              >
                Track Package <Search className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-32 w-32 text-white opacity-20 animate-pulse" />
              </div>
              <div className="absolute -left-4 top-1/4 h-20 w-20 rounded-full bg-primary/20 animate-pulse" />
              <div className="absolute -right-4 top-1/2 h-16 w-16 rounded-full bg-primary/30 animate-pulse delay-300" />
              <div className="absolute bottom-1/4 left-1/3 h-24 w-24 rounded-full bg-primary/10 animate-pulse delay-700" />
            </div>
          </div>
        </div>

        {/* Slider indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentSlide ? "bg-white w-6" : "bg-white/30",
              )}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
