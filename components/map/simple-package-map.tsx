"use client"

import { useEffect, useRef } from "react"

interface Coordinates {
  lat: number
  lng: number
}

interface Checkpoint {
  id: string
  status: string
  location: string
  timestamp: string
  details: string
  isCompleted: boolean
  coordinates: Coordinates
}

interface PackageData {
  tracking_number: string
  status: string
  statusText: string
  current_location: {
    latitude: number
    longitude: number
    address: string
  }
}

interface SimplePackageMapProps {
  packageData: PackageData
  checkpoints: Checkpoint[]
  height?: string
}

export default function SimplePackageMap({ packageData, checkpoints, height = "300px" }: SimplePackageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simple map implementation that doesn't rely on external libraries
    // This is a placeholder that shows the current location and checkpoints
    if (!mapRef.current) return

    const mapContainer = mapRef.current
    mapContainer.innerHTML = ""

    // Create a simple map container
    const mapDiv = document.createElement("div")
    mapDiv.className = "relative w-full h-full bg-slate-100 rounded-lg overflow-hidden"

    // Add current location marker
    const currentMarker = document.createElement("div")
    currentMarker.className = "absolute w-4 h-4 bg-red-500 rounded-full z-20 animate-pulse"
    currentMarker.style.transform = "translate(-50%, -50%)"

    // Position the current marker (simplified positioning)
    const { latitude, longitude } = packageData.current_location
    // Simple scaling to position markers in the container
    const latRange = 10 // Approximate range of latitudes to display
    const lngRange = 20 // Approximate range of longitudes to display

    const latMin = Math.min(...checkpoints.map((cp) => cp.coordinates.lat), latitude) - 1
    const latMax = Math.max(...checkpoints.map((cp) => cp.coordinates.lat), latitude) + 1
    const lngMin = Math.min(...checkpoints.map((cp) => cp.coordinates.lng), longitude) - 1
    const lngMax = Math.max(...checkpoints.map((cp) => cp.coordinates.lng), longitude) + 1

    // Position current marker
    const currentX = ((longitude - lngMin) / (lngMax - lngMin)) * 100
    const currentY = (1 - (latitude - latMin) / (latMax - latMin)) * 100
    currentMarker.style.left = `${currentX}%`
    currentMarker.style.top = `${currentY}%`

    // Add checkpoint markers
    checkpoints.forEach((checkpoint, index) => {
      const { lat, lng } = checkpoint.coordinates
      const markerX = ((lng - lngMin) / (lngMax - lngMin)) * 100
      const markerY = (1 - (lat - latMin) / (latMax - latMin)) * 100

      const marker = document.createElement("div")
      marker.className = `absolute w-3 h-3 rounded-full z-10 ${checkpoint.isCompleted ? "bg-green-500" : "bg-gray-400"}`
      marker.style.transform = "translate(-50%, -50%)"
      marker.style.left = `${markerX}%`
      marker.style.top = `${markerY}%`

      // Add tooltip
      marker.title = `${checkpoint.status} - ${checkpoint.location}`

      mapDiv.appendChild(marker)

      // Add connecting lines between checkpoints
      if (index > 0) {
        const prevCheckpoint = checkpoints[index - 1]
        const prevX = ((prevCheckpoint.coordinates.lng - lngMin) / (lngMax - lngMin)) * 100
        const prevY = (1 - (prevCheckpoint.coordinates.lat - latMin) / (latMax - latMin)) * 100

        const line = document.createElement("div")
        line.className = "absolute h-0.5 bg-gray-300 origin-left z-0"

        // Calculate line position and rotation
        const length = Math.sqrt(Math.pow(markerX - prevX, 2) + Math.pow(markerY - prevY, 2))
        const angle = Math.atan2(markerY - prevY, markerX - prevX) * (180 / Math.PI)

        line.style.width = `${length}%`
        line.style.left = `${prevX}%`
        line.style.top = `${prevY}%`
        line.style.transform = `rotate(${angle}deg)`

        mapDiv.appendChild(line)
      }
    })

    // Add current location marker last so it's on top
    mapDiv.appendChild(currentMarker)

    // Add a legend
    const legend = document.createElement("div")
    legend.className = "absolute bottom-2 right-2 bg-white/80 p-2 rounded-md text-xs z-30"
    legend.innerHTML = `
      <div class="flex items-center gap-2 mb-1">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span>Current Location</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span>Checkpoint</span>
      </div>
    `

    mapDiv.appendChild(legend)

    // Add a disclaimer
    const disclaimer = document.createElement("div")
    disclaimer.className = "absolute top-2 left-2 bg-white/80 p-2 rounded-md text-xs z-30"
    disclaimer.textContent = "Simplified map view - locations are approximate"

    mapDiv.appendChild(disclaimer)

    mapContainer.appendChild(mapDiv)
  }, [packageData, checkpoints])

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg border overflow-hidden"
      style={{ height }}
      aria-label="Package location map"
    />
  )
}
