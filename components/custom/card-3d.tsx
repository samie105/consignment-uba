"\"use client"

import type React from "react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

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
