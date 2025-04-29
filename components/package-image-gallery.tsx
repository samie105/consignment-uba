"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ImageProps {
  id: string
  url: string
  alt: string
  timestamp?: string
  location?: string
  type?: string
}

export function PackageImageGallery({ images }: { images: ImageProps[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group overflow-hidden rounded-lg border cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white h-8 w-8" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
              <p className="font-medium truncate">{image.location}</p>
              <p className="text-xs opacity-80">{image.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-gray-800">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <img
                src={images[currentIndex]?.url || "/placeholder.svg"}
                alt={images[currentIndex]?.alt}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>

            <div className="absolute inset-y-0 left-4 flex items-center">
              <button onClick={handlePrevious} className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center">
              <button onClick={handleNext} className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <p className="font-medium">{images[currentIndex]?.alt}</p>
              <div className="flex justify-between text-sm mt-1">
                <span>{images[currentIndex]?.location}</span>
                <span>{images[currentIndex]?.timestamp}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Also export as default for backward compatibility
export default PackageImageGallery
