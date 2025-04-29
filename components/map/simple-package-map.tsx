"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

interface Coordinates {
  lat: number
  lng: number
}

interface Location {
  coordinates: Coordinates
  address?: string
  timestamp?: string
  description?: string
  location?: string
}

interface PackageMapProps {
  packageData: any
  checkpoints?: any[]
  height?: string
}

// Simple world map coordinates
const MAP_WIDTH = 800
const MAP_HEIGHT = 400

export default function SimplePackageMap({ packageData, checkpoints = [], height = "400px" }: PackageMapProps) {
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    // Collect all valid locations from checkpoints and current location
    const validLocations: Location[] = []

    // Add current location if available
    if (packageData?.current_location?.latitude && packageData?.current_location?.longitude) {
      validLocations.push({
        coordinates: {
          lat: packageData.current_location.latitude,
          lng: packageData.current_location.longitude,
        },
        address: packageData.current_location.address,
        description: "Current Location",
        location: "Current Location",
      })
    }

    // Add checkpoints with valid coordinates
    if (checkpoints && checkpoints.length > 0) {
      checkpoints.forEach((checkpoint) => {
        if (checkpoint.coordinates?.lat && checkpoint.coordinates?.lng) {
          validLocations.push({
            coordinates: {
              lat: checkpoint.coordinates.lat,
              lng: checkpoint.coordinates.lng,
            },
            address: checkpoint.address,
            description: checkpoint.description,
            location: checkpoint.location,
            timestamp: checkpoint.timestamp,
          })
        }
      })
    }

    setLocations(validLocations)
  }, [packageData, checkpoints])

  // Convert lat/lng to x/y coordinates on the map
  const latLngToPoint = (lat: number, lng: number) => {
    // Simple conversion for demonstration
    const x = ((lng + 180) / 360) * MAP_WIDTH
    const y = ((90 - lat) / 180) * MAP_HEIGHT
    return { x, y }
  }

  // If no locations, show a message
  if (locations.length === 0) {
    return (
      <div style={{ height }} className="border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No location data available</p>
      </div>
    )
  }

  return (
    <div style={{ height }} className="relative border border-gray-200 rounded-lg overflow-hidden">
      {/* Simple world map background */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="bg-blue-50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simple world map outline - just a placeholder */}
        <path d="M150,50 L650,50 L650,350 L150,350 Z" fill="none" stroke="#e5e7eb" strokeWidth="1" />

        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`horizontal-${i}`}
            x1="0"
            y1={i * 100}
            x2={MAP_WIDTH}
            y2={i * 100}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`vertical-${i}`}
            x1={i * 100}
            y1="0"
            x2={i * 100}
            y2={MAP_HEIGHT}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Location markers */}
        {locations.map((location, index) => {
          const { x, y } = latLngToPoint(location.coordinates.lat, location.coordinates.lng)

          return (
            <g key={index} transform={`translate(${x}, ${y})`} className="cursor-pointer">
              <circle r="8" fill={index === locations.length - 1 ? "#3b82f6" : "#9ca3af"} />
              <circle r="4" fill="white" />

              {/* Location label */}
              <text
                x="0"
                y="-12"
                textAnchor="middle"
                fill="#374151"
                fontSize="10"
                fontWeight={index === locations.length - 1 ? "bold" : "normal"}
              >
                {location.location || "Location"}
              </text>
            </g>
          )
        })}

        {/* Connection lines between points */}
        {locations.length > 1 && (
          <g>
            {locations.map((location, index) => {
              if (index === 0) return null

              const prevLocation = locations[index - 1]
              const { x: x1, y: y1 } = latLngToPoint(prevLocation.coordinates.lat, prevLocation.coordinates.lng)
              const { x: x2, y: y2 } = latLngToPoint(location.coordinates.lat, location.coordinates.lng)

              return (
                <line
                  key={`line-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              )
            })}
          </g>
        )}
      </svg>

      {/* Location details */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-xs border-t border-gray-200">
        <div className="flex items-center">
          <MapPin size={14} className="text-blue-500 mr-1" />
          <span className="font-semibold">{locations[locations.length - 1]?.location || "Current Location"}:</span>
          <span className="ml-1 truncate">{locations[locations.length - 1]?.address || "No address available"}</span>
        </div>
      </div>
    </div>
  )
}
