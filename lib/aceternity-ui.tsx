"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Spotlight effect component
export const Spotlight = ({
  className = "",
  fill = "white",
}: {
  className?: string
  fill?: string
}) => {
  return (
    <svg
      className={cn("animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse cx="1893.5" cy="1421" rx="1893.5" ry="1421" fill={fill} fillOpacity="0.21" />
      </g>
      <defs>
        <filter
          id="filter"
          x="0"
          y="0"
          width="3787"
          height="2842"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  )
}

// Animated border component
export const AnimatedBorder = ({
  children,
  className,
  containerClassName,
  duration = 1000,
  borderRadius = "1.5rem",
  highlightColor = "var(--highlight-color)",
  ...props
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  duration?: number
  borderRadius?: string
  highlightColor?: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseEnter = () => {
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-[--border-radius] border border-neutral-200 dark:border-neutral-800 overflow-hidden group bg-primary/10",
        containerClassName,
      )}
      style={
        {
          "--border-radius": borderRadius,
          "--highlight-color": highlightColor,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className={cn("relative z-10 rounded-[--border-radius]", className)}>{children}</div>
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-150"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--highlight-color), transparent 40%)`,
          transitionDuration: `${duration}ms`,
        }}
      />
    </div>
  )
}

// Text reveal effect
export const TextReveal = ({
  children,
  className,
  threshold = 0.5,
  ...props
}: {
  children: React.ReactNode
  className?: string
  threshold?: number
} & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// 3D Card effect
export const Card3D = ({
  children,
  className,
  containerClassName,
  rotationIntensity = 10,
  ...props
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  rotationIntensity?: number
} & React.HTMLAttributes<HTMLDivElement>) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * rotationIntensity
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * rotationIntensity

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div
      className={cn("perspective-1000", containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={cardRef}
        className={cn("transition-transform duration-150 ease-out", isHovered ? "shadow-lg" : "", className)}
        style={{
          transform: isHovered ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` : "none",
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Meteors animation
export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number
  className?: string
}) => {
  const meteors = [...Array(number)].map((_, i) => (
    <span
      key={i}
      className={cn(
        "animate-meteor absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-white shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
        "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[rgba(255,255,255,0)] before:to-[rgba(255,255,255,0.8)]",
      )}
      style={{
        top: `${Math.floor(Math.random() * 100)}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 2 + 0.5}s`,
      }}
    />
  ))

  return <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>{meteors}</div>
}

// Shimmer effect
export const Shimmer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent shimmer" />
    </div>
  )
}

// Apple Card Carousel
export const AppleCardCarousel = ({
  items,
  className,
  cardClassName,
  renderItem,
}: {
  items: any[]
  className?: string
  cardClassName?: string
  renderItem: (item: any, index: number) => React.ReactNode
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startScrollLeft, setStartScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    if ("clientX" in e) {
      setStartX(e.clientX)
    } else {
      setStartX(e.touches[0].clientX)
    }
    if (carouselRef.current) {
      setStartScrollLeft(carouselRef.current.scrollLeft)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft
      const cardWidth = carouselRef.current.offsetWidth
      const newIndex = Math.round(scrollPosition / cardWidth)
      setActiveIndex(newIndex)

      // Smooth scroll to the nearest card
      carouselRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: "smooth",
      })
    }
  }

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    let clientX = 0
    if ("clientX" in e) {
      clientX = e.clientX
      e.preventDefault()
    } else {
      clientX = e.touches[0].clientX
    }

    const x = clientX - startX
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = startScrollLeft - x
    }
  }

  const handleCardClick = (index: number) => {
    if (isDragging) return
    setActiveIndex(index)
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.offsetWidth,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: activeIndex * carouselRef.current.offsetWidth,
          behavior: "auto",
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeIndex])

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide scroll-smooth"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onMouseMove={handleDragMove}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onTouchMove={handleDragMove}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "min-w-full snap-center flex-shrink-0 cursor-grab transition-transform duration-300",
              isDragging && "cursor-grabbing",
              cardClassName,
            )}
            onClick={() => handleCardClick(index)}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex ? "bg-primary w-6" : "bg-primary/30",
            )}
            onClick={() => handleCardClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
