"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Package, Truck, Plane, Ship, Globe, Clock } from "lucide-react"
import { useTheme } from "next-themes"

export default function About() {
  const { theme } = useTheme()

  const aboutItems = [
    {
      category: "Speed",
      title: "Faster Shipments",
      description:
        "Our optimized logistics network ensures your packages arrive ahead of schedule, with 98% of deliveries reaching their destination before the estimated time.",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/faster-shipments.jpg-5WskrzgxxStxjh1JiXuSTPLgYrw3oY.jpeg",
    },
    {
      category: "Reliability",
      title: "Guaranteed Delivery",
      description:
        "With our advanced tracking technology and dedicated fleet, we maintain a 99.7% successful delivery rate even during peak seasons and challenging conditions.",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/second%20image.jpg-uZ2XhuMxM67NZOVEhHPs9CqUX6xgao.jpeg",
    },
    {
      category: "Global",
      title: "Worldwide Network",
      description:
        "Our presence in over 150 countries means your packages can reach virtually any destination, with local expertise ensuring smooth customs clearance and handling.",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/third%20image.jpg-cbQUxve7i01HPBBPSDjh6OGCX1we9f.jpeg",
    },
    {
      category: "Innovation",
      title: "Smart Solutions",
      description:
        "From AI-powered route optimization to sustainable packaging options, we're constantly innovating to make shipping more efficient, affordable, and eco-friendly.",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/growth%20image.jpg-o8LUrB1qtvmJ6IvOEBQXwZuz9YBZEM.jpeg",
    },
  ]

  return (
    <section id="about" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 dark:from-background/20 dark:to-background/100 z-0"></div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Package className="absolute h-10 w-10 text-primary/20 animate-float1" style={{ top: "15%", left: "10%" }} />
        <Truck className="absolute h-12 w-12 text-primary/30 animate-float2" style={{ top: "60%", left: "15%" }} />
        <Plane className="absolute h-10 w-10 text-primary/25 animate-float3" style={{ top: "25%", right: "15%" }} />
        <Ship className="absolute h-14 w-14 text-primary/20 animate-float4" style={{ bottom: "20%", right: "10%" }} />
        <Clock className="absolute h-8 w-8 text-primary/30 animate-float5" style={{ top: "40%", left: "50%" }} />
        <Globe className="absolute h-6 w-6 text-primary/20 animate-float6" style={{ bottom: "30%", left: "30%" }} />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-left mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl relative inline-block">
              About Us
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full"></span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed mt-6 font-light">
              Discover the story, mission, and values that drive our commitment to excellence in global logistics and
              delivery solutions.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden h-[400px] relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10 dark:from-black/60 dark:via-black/30"></div>
              <Image
                src={item.src || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <p className="text-white/80 dark:text-white/90 text-sm font-medium">{item.category}</p>
                <h3 className="text-white dark:text-white text-xl font-bold mt-1">{item.title}</h3>
                <p className="text-white/90 dark:text-white/95 text-sm mt-2 line-clamp-4">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
