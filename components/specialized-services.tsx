"use client"

import { Timeline } from "@/components/ui/timeline"
import { Package, Clock, Shield, Truck, Plane, Ship, Warehouse, Globe } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function SpecializedServices() {
  const timelineData = [
    {
      title: "Express Delivery",
      content: (
        <div className="bg-card dark:bg-card/80 rounded-xl p-6 shadow-sm border border-primary/20 mb-8 dark:text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2 md:mb-0">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-center md:text-left">Time-Critical Solutions</h4>
              <p className="text-muted-foreground dark:text-gray-300 text-center md:text-left">
                When every minute counts, our express delivery service ensures your packages arrive exactly when needed.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h5 className="text-sm font-medium mb-2">Features:</h5>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Same-day delivery in select areas
                </li>
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Guaranteed delivery times
                </li>
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Real-time tracking updates
                </li>
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Priority handling at all stages
                </li>
              </ul>
            </div>
            <div className="relative h-40 md:h-full rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialized%20service%20six.jpg-a0bvGxKwttRQ2V2wsNh6GWoLcLIHUc.jpeg"
                alt="Express Delivery"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Secure Transport",
      content: (
        <div className="bg-card dark:bg-card/80 rounded-xl p-6 shadow-sm border border-primary/20 mb-8 dark:text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-center md:text-left">Enhanced Security Measures</h4>
              <p className="text-muted-foreground dark:text-gray-300 text-center md:text-left">
                For high-value and sensitive shipments, our secure transport service provides peace of mind with
                advanced security protocols.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="relative h-40 md:h-full rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialized%20service%20three.jpg-n5EwOVFQBFfVLoa6KZzUcTkulCEzDH.jpeg"
                alt="Secure Transport"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Security Features:</h5>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Tamper-evident packaging
                </li>
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  GPS tracking on all vehicles
                </li>
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Vetted and trained security personnel
                </li>
                <li className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Insurance options up to $1M
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Special Cargo",
      content: (
        <div className="bg-card dark:bg-card/80 rounded-xl p-6 shadow-sm border border-primary/20 mb-8 dark:text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2 md:mb-0">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-center md:text-left">Specialized Handling</h4>
              <p className="text-muted-foreground dark:text-gray-300 text-center md:text-left">
                Delicate, oversized, or unusual items require special attention. Our specialized cargo service ensures
                proper handling from pickup to delivery.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="md:col-span-2">
              <h5 className="text-sm font-medium mb-2">We handle:</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Fine art and antiques
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Medical equipment
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Fragile electronics
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Oversized machinery
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Temperature-sensitive items
                </div>
                <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Hazardous materials
                </div>
              </div>
            </div>
            <div className="relative h-40 md:h-full rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialized%20service%20four.jpg-pfrcxa95187hIOU569iQPvi6bFmRYD.jpeg"
                alt="Special Cargo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Global Network",
      content: (
        <div className="bg-card dark:bg-card/80 rounded-xl p-6 shadow-sm border border-primary/20 mb-8 dark:text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2 md:mb-0">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-center md:text-left">Worldwide Coverage</h4>
              <p className="text-muted-foreground dark:text-gray-300 text-center md:text-left">
                With operations in over 150 countries, our global network ensures seamless international shipping with
                local expertise at every destination.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialized%20service%20five.jpg-dWPhcnm7eC3GkZAJGSJiEHDKhaI7su.jpeg"
                alt="Global Network"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Our global presence continues to expand</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">150+</p>
                <p className="text-xs text-muted-foreground dark:text-gray-300">Countries</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">1,200+</p>
                <p className="text-xs text-muted-foreground dark:text-gray-300">Distribution Centers</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">25,000+</p>
                <p className="text-xs text-muted-foreground dark:text-gray-300">Delivery Vehicles</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-xs text-muted-foreground dark:text-gray-300">On-time Delivery</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Integrated Solutions",
      content: (
        <div className="bg-card dark:bg-card/80 rounded-xl p-6 shadow-sm border border-primary/20 mb-8 dark:text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-2 md:mb-0">
              <Warehouse className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-center md:text-left">End-to-End Logistics</h4>
              <p className="text-muted-foreground dark:text-gray-300 text-center md:text-left">
                Our integrated solutions combine multiple transportation methods and services for optimal efficiency and
                cost-effectiveness.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <Truck className="h-8 w-8 text-primary mb-2" />
              <h5 className="font-medium mb-1">Road Freight</h5>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Reliable transportation for local and interstate deliveries with flexible scheduling options.
              </p>
              <div className="relative h-32 mt-4 rounded-lg overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specilized%20service%20two.jpg-uRc5autpi5lAiO8JOLoYkmXs0ET9L5.jpeg"
                  alt="Road Freight"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <Plane className="h-8 w-8 text-primary mb-2" />
              <h5 className="font-medium mb-1">Air Freight</h5>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Express solutions for time-sensitive international shipments with priority handling.
              </p>
              <div className="relative h-32 mt-4 rounded-lg overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialized%20service%207.jpg-98iw1UCCPJRMOD2wxc3yMLx0MyxQEk.jpeg"
                  alt="Air Freight"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <Ship className="h-8 w-8 text-primary mb-2" />
              <h5 className="font-medium mb-1">Ocean Freight</h5>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Cost-effective options for large shipments with full container and shared container services.
              </p>
              <div className="relative h-32 mt-4 rounded-lg overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/specialized%20service%20one.jpg-XoLETLSFw2Any7ceKhsn1PQapl3vZ4.jpeg"
                  alt="Ocean Freight"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="specialized-services" className="py-8 bg-background">
      <div className="">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Specialized Services</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              Expert handling of special cargo types with dedicated solutions for unique shipping requirements.
            </p>
          </motion.div>
        </div>

        <Timeline data={timelineData} />
      </div>
    </section>
  )
}
