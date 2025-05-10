"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock sponsor data
const sponsors = [
  {
    id: 1,
    name: "Acme Logistics",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "platinum",
  },
  {
    id: 2,
    name: "FastTrack Shipping",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "platinum",
  },
  {
    id: 3,
    name: "SecureBox",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "gold",
  },
  {
    id: 4,
    name: "EcoShip",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "gold",
  },
  {
    id: 5,
    name: "TechTrack",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "silver",
  },
  {
    id: 6,
    name: "Global Connect",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "silver",
  },
  {
    id: 7,
    name: "SafeDelivery",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "bronze",
  },
  {
    id: 8,
    name: "QuickShip",
    logo: "/placeholder.svg?height=80&width=200",
    tier: "bronze",
  },
]

export default function SponsorsSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const [itemsPerView, setItemsPerView] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setItemsPerView(1)
      } else if (window.innerWidth < 640) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        nextSlide()
      }, 3000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, activeSlide])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1 >= sponsors.length - (itemsPerView - 1) ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? Math.max(0, sponsors.length - itemsPerView) : prev - 1))
  }

  const pauseAutoplay = () => setAutoplay(false)
  const resumeAutoplay = () => setAutoplay(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="sponsors" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Trusted Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transivio collaborates with industry-leading partners to provide comprehensive delivery solutions
            worldwide. These strategic alliances enhance our service quality and global reach, ensuring reliable
            delivery experiences for all our customers.
          </p>
        </motion.div>

        <div className="relative overflow-hidden py-8" onMouseEnter={pauseAutoplay} onMouseLeave={resumeAutoplay}>
          <motion.div
            className="flex transition-all duration-500 ease-in-out"
            style={{
              transform: `translateX(-${activeSlide * (100 / itemsPerView)}%)`,
            }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                className={cn("flex-shrink-0 px-4 transition-all duration-300")}
                style={{ width: `${100 / itemsPerView}%` }}
                variants={itemVariants}
              >
                <div className="h-full rounded-lg p-6 flex flex-col items-center justify-center text-center bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 relative h-16 w-full">
                    <Image
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={`${sponsor.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h4 className="text-base font-medium">{sponsor.name}</h4>
                  <span className="text-xs text-muted-foreground capitalize mt-1">{sponsor.tier} Partner</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={prevSlide}
              aria-label="Previous sponsors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={nextSlide}
              aria-label="Next sponsors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">Why Partner With Us</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-primary/5 p-5 rounded-lg">
              <h4 className="text-lg font-medium mb-2 text-primary">Global Reach</h4>
              <p className="text-sm text-muted-foreground">
                Access to over 150 countries worldwide, expanding your market presence.
              </p>
            </div>
            <div className="bg-primary/5 p-5 rounded-lg">
              <h4 className="text-lg font-medium mb-2 text-primary">Technology Integration</h4>
              <p className="text-sm text-muted-foreground">Leverage our advanced tracking and logistics technology.</p>
            </div>
            <div className="bg-primary/5 p-5 rounded-lg">
              <h4 className="text-lg font-medium mb-2 text-primary">Co-Marketing</h4>
              <p className="text-sm text-muted-foreground">
                Joint marketing initiatives to boost your brand visibility.
              </p>
            </div>
          </div>
          <Button className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">Become a Partner</Button>
        </motion.div>
      </div>
    </section>
  )
}
