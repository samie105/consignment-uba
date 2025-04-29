"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Package, Globe, TrendingUp, Award, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface MetricProps {
  value: number
  title: string
  description: string
  icon: React.ReactNode
  suffix?: string
  duration?: number
  delay?: number
}

const Metric = ({ value, title, description, icon, suffix = "", duration = 2, delay = 0 }: MetricProps) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { theme } = useTheme()

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const totalDuration = duration * 1000
      const incrementTime = totalDuration / end
      const timer = setTimeout(() => {
        const counter = setInterval(() => {
          start += 1
          setCount(start)
          if (start >= end) clearInterval(counter)
        }, incrementTime)
        return () => clearInterval(counter)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, value, duration, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay }}
      className="relative group"
    >
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={theme === "dark" ? "rgba(var(--primary-rgb), 0.1)" : "rgba(var(--primary-rgb), 0.05)"}
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={2 * Math.PI * 45 * (1 - value / 100)}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={
                  isInView
                    ? {
                        strokeDashoffset: 2 * Math.PI * 45 * (1 - value / 100),
                        transition: { duration: 2, delay: delay, ease: "easeOut" },
                      }
                    : {}
                }
              />
            </svg>
            {/* Text outside SVG to keep it horizontal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm opacity-70 font-bold">
                {count}
                {suffix}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium sm:text-lg md:font-semibold">{title}</h3>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Metrics() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { theme } = useTheme()

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Remove the previous grid background */}

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
          {/* Top right grid for small and medium screens */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 -z-10 lg:hidden overflow-hidden">
            <div className="w-full h-full dark:bg-dot-white/[0.7] bg-dot-black/[0.7] relative">
              {/* Radial gradient for the container to give a faded look */}
              <div className="absolute pointer-events-none inset-0 dark:bg-background bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              {/* Additional gradient overlay with primary color */}
              <div className="absolute inset-0 bg-gradient-to-br from-background to-transparent"></div>
            </div>
          </div>

          {/* Top left grid for large screens */}
          <div className="absolute -top-5 left-0 w-1/2 h-full -z-10 hidden lg:block overflow-hidden">
            <div className="w-full h-1/2 dark:bg-dot-white/[0.7] bg-dot-black/[0.7] relative">
              {/* Radial gradient for the container to give a faded look */}
              <div className="absolute pointer-events-none inset-0 dark:bg-background bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              {/* Additional gradient overlay with primary color */}
              <div className="absolute inset-0 bg-gradient-to-br from-background to-transparent"></div>
            </div>
          </div>

          {/* Left side - Hero text and button */}
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Our Global Impact
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground md:text-xl max-w-xl"
            >
              Delivering excellence across the world with speed, reliability, and precision. Our metrics showcase our
              commitment to quality service.
            </motion.p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Track Package
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Track Your Package</DialogTitle>
                  <DialogDescription>
                    Enter your tracking number to get real-time updates on your shipment.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Input id="trackingNumber" placeholder="Enter tracking number" className="w-full" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Search className="mr-2 h-4 w-4" /> Track
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right side - Metrics cards */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <Metric
              icon={<Package className="h-12 w-12" />}
              value={85}
              suffix="%"
              title="Delivery Success Rate"
              description="Consistently achieving high success rates"
              delay={0.1}
            />
            <Metric
              icon={<Globe className="h-12 w-12" />}
              value={95}
              suffix="%"
              title="Global Coverage Area"
              description="Extensive network worldwide"
              delay={0.2}
            />
            <Metric
              icon={<TrendingUp className="h-12 w-12" />}
              value={99}
              suffix="%"
              title="On-Time Performance"
              description="Meeting delivery deadlines with precision"
              delay={0.3}
            />
            <Metric
              icon={<Award className="h-12 w-12" />}
              value={92}
              suffix="%"
              title="Customer Satisfaction"
              description="Exceptional service quality"
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
