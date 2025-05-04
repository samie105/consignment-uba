"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"


export function PackageImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setIsZoomed(false)
  }

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1
    const newIndex = isLastImage ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  if (!images || images.length === 0) {
    return <div className="text-center py-8">No images available</div>
  }

  const currentImage = images[currentIndex]

  return (
    <div className="relative">
      {/* Main image container */}
      <div
        className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={toggleZoom}
      >
        <div
          className={`transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"}`}
          style={{ transformOrigin: "center center" }}
        >
          <img
            src={currentImage || "/placeholder.svg"}
            alt={currentImage}
            className="w-full h-auto object-cover rounded-lg"
            style={{ maxHeight: "500px", width: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Zoom button */}
        <button
          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            toggleZoom()
          }}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Image metadata */}
      <div className="mt-4 p-4 bg-muted/20 rounded-lg">
        {/* <p className="text-sm font-medium">{currentImage.alt}</p> */}
        <div className="flex flex-col sm:flex-row sm:justify-between mt-2 text-sm text-muted-foreground">
          {/* <p>{currentImage.timestamp}</p>
          <p>{currentImage.location}</p> */}
        </div>
      </div>

      {/* Navigation controls */}
      {images.length > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsZoomed(false)
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-primary/30"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

// Add default export for backward compatibility
export default PackageImageGallery
