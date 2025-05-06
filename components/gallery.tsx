"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Truck, Plane, Ship, Package, Clock, Shield, Warehouse, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

const operations = [
  {
    title: "Global Distribution Network",
    description: "Our extensive network ensures efficient delivery across continents with strategic hubs.",
    features: [
      {
        icon: <Plane className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Air Operations",
        description: "State-of-the-art air freight facilities for time-sensitive shipments across the globe.",
        size: "md:col-span-6 lg:col-span-4 md:row-span-1",
      },
      {
        icon: <Ship className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Sea Routes",
        description: "Major shipping lanes coverage with reliable ocean freight solutions for large cargo.",
        size: "md:col-span-6 lg:col-span-4 md:row-span-1",
      },
      {
        icon: <Truck className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Ground Fleet",
        description: "Modern vehicle fleet providing efficient last-mile delivery and regional transportation.",
        size: "md:col-span-12 lg:col-span-4 md:row-span-1",
      },
    ],
  },
  {
    title: "Advanced Logistics Centers",
    description: "Modern warehousing and distribution centers equipped with latest technology.",
    features: [
      {
        icon: <Package className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Automated Sorting",
        description: "High-speed package sorting systems that process thousands of packages per hour with precision.",
        size: "md:col-span-6 lg:col-span-4 md:row-span-1",
      },
      {
        icon: <Warehouse className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Smart Storage",
        description: "Intelligent warehouse management systems optimizing space and inventory tracking.",
        size: "md:col-span-6 lg:col-span-4 md:row-span-1",
      },
      {
        icon: <Shield className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Security Systems",
        description: "24/7 monitored facilities with advanced security protocols to protect your valuable shipments.",
        size: "md:col-span-12 lg:col-span-4 md:row-span-1",
      },
    ],
  },
  {
    title: "Last Mile Excellence",
    description: "Optimized local delivery networks for timely and efficient last-mile service.",
    features: [
      {
        icon: <Truck className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Urban Delivery",
        description:
          "Efficient city logistics with optimized routes and eco-friendly delivery options for urban areas.",
        size: "md:col-span-6 lg:col-span-4 md:row-span-1",
      },
      {
        icon: <Globe className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Rural Coverage",
        description: "Extensive rural network ensuring even remote locations receive reliable delivery service.",
        size: "md:col-span-6 lg:col-span-4 md:row-span-1",
      },
      {
        icon: <Clock className="h-8 w-8 text-primary" />,
        image: "/placeholder.svg?height=400&width=600",
        title: "Express Service",
        description: "Priority handling options for time-sensitive deliveries with guaranteed delivery windows.",
        size: "md:col-span-12 lg:col-span-4 md:row-span-1",
      },
    ],
  },
]

const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`

export default function Gallery() {
  const [selectedOperation, setSelectedOperation] = useState(0)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <section className="py-16 bg-muted/30 dark:bg-background/30 relative overflow-hidden">
      <style jsx global>
        {scrollbarHideStyles}
      </style>
      {/* Shooting stars and stars background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ShootingStars starColor="hsl(var(--primary))" trailColor="hsl(var(--primary)/30)" />
        <StarsBackground starDensity={0.0001} className="opacity-50" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            >
              {operations[selectedOperation].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-muted-foreground md:text-xl max-w-3xl mx-auto"
            >
              {operations[selectedOperation].description}
            </motion.p>
          </div>

          {/* Operation selector tabs - swipeable on mobile */}
          <div className="relative w-full mb-8">
            <ScrollArea className="w-full pb-4">
              <ScrollBar orientation="horizontal" />
              <div
                id="operation-tabs"
                className="flex space-x-2 touch-pan-x overflow-x-auto scrollbar-hide sm:snap-none snap-x snap-mandatory"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  paddingBottom: "10px",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                }}
                role="region"
                aria-label="Scrollable operations"
              >
                {operations.map((operation, index) => (
                  <Button
                    key={index}
                    variant={selectedOperation === index ? "default" : "outline"}
                    onClick={() => setSelectedOperation(index)}
                    className="whitespace-nowrap flex-shrink-0 sm:snap-align-none snap-center min-w-[200px] md:min-w-[250px] text-sm md:text-base"
                  >
                    {operation.title}
                  </Button>
                ))}
              </div>
              <div className="mt-2 text-center text-xs text-muted-foreground md:hidden">
                <span>← Swipe to see more →</span>
              </div>
            </ScrollArea>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {operations[selectedOperation].features.map((feature, featureIndex) => (
              <motion.div
                key={featureIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                viewport={{ once: true }}
                className={cn("col-span-1", feature.size)}
              >
                <Card
                  className="h-full overflow-hidden cursor-pointer transition-all hover:shadow-lg border-border/50 hover:border-primary/30 group"
                  onClick={() => setSelectedImage(featureIndex)}
                >
                  <CardContent className="p-0 h-full">
                    <div className="flex flex-col h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent"></div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 + featureIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="absolute top-4 left-4 bg-background/80 dark:bg-background/60 backdrop-blur-sm p-2 rounded-full"
                        >
                          {feature.icon}
                        </motion.div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <motion.h3
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + featureIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="text-xl font-bold mb-2"
                        >
                          {feature.title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 + featureIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="text-muted-foreground text-sm flex-1"
                        >
                          {feature.description}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + featureIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 self-end group-hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedImage(featureIndex)
                            }}
                          >
                            View Details
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="relative aspect-video">
              <Image
                src={operations[selectedOperation].features[selectedImage].image || "/placeholder.svg"}
                alt={operations[selectedOperation].features[selectedImage].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold">{operations[selectedOperation].features[selectedImage].title}</h3>
              <p className="text-muted-foreground">
                {operations[selectedOperation].features[selectedImage].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
