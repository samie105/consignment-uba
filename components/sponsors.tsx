"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

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
    tier: "gold",
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
    tier: "silver",
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

// Group sponsors by tier
const sponsorsByTier = sponsors.reduce(
  (acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = []
    }
    acc[sponsor.tier].push(sponsor)
    return acc
  },
  {} as Record<string, typeof sponsors>,
)

// Order of tiers for display
const tierOrder = ["platinum", "gold", "silver", "bronze"]

export function Sponsors() {
  return (
    <section id="sponsors" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Trusted Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transivio is proud to collaborate with industry-leading partners who share our commitment to excellence,
            innovation, and customer satisfaction. These strategic alliances enable us to provide comprehensive delivery
            solutions across the globe.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">Why Partner With Us</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-medium mb-3 text-primary">Global Reach</h4>
              <p className="text-card-foreground">
                Join our network of partners to expand your reach to over 150 countries worldwide, accessing new markets
                and customer bases.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-medium mb-3 text-primary">Technology Integration</h4>
              <p className="text-card-foreground">
                Leverage our cutting-edge tracking and logistics technology to enhance your service offerings and
                operational efficiency.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-medium mb-3 text-primary">Co-Marketing Opportunities</h4>
              <p className="text-card-foreground">
                Benefit from joint marketing initiatives, brand exposure, and collaborative promotional campaigns to
                boost visibility.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Our Partners</h3>
          <SponsorSlider sponsors={sponsors} />
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold mb-4">Become a Partner</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Interested in joining our partner network? We're always looking for innovative companies to collaborate with
            in delivering exceptional service to customers worldwide.
          </p>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
            Contact Our Partnership Team
          </button>
        </div>
      </div>
    </section>
  )
}

interface SponsorSliderProps {
  sponsors: typeof sponsors
}

function SponsorSlider({ sponsors }: SponsorSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Number of sponsors to show at once based on screen size
  const [itemsToShow, setItemsToShow] = useState(5)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3)
      } else {
        setItemsToShow(5)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Auto-animate the slider
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1 >= sponsors.length - itemsToShow + 1 ? 0 : prevIndex + 1))
    }, 2000)

    return () => clearInterval(interval)
  }, [sponsors.length, itemsToShow])

  return (
    <div className="relative">
      <div ref={sliderRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        >
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex-shrink-0 p-4 transition-all duration-300"
              style={{ width: `${100 / itemsToShow}%` }}
            >
              <div className="h-full rounded-lg p-4 flex items-center justify-center bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-16 w-full">
                  <Image
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={`${sponsor.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
