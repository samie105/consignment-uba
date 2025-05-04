"use client"

import type React from "react"
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export interface LocationUpdateEvent {
  lat: number
  lng: number
  address: string
}

export interface LocationPickerRef {
  getLocation: () => Promise<LocationUpdateEvent | null>
}

interface LocationPickerProps {
  initialLocation?: {
    latitude: number
    longitude: number
  }
}

const LocationPicker = forwardRef<LocationPickerRef, LocationPickerProps>(({ initialLocation }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<LocationUpdateEvent | null>(null)

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      return data.display_name || "Address not found"
    } catch (error) {
      console.error("Error getting address:", error)
      return "Address not found"
    }
  }

  const handleLocationUpdate = async (lat: number, lng: number) => {
    const address = await getAddressFromCoordinates(lat, lng)
    const location = { lat, lng, address }
    setCurrentLocation(location)
    return location
  }

  useImperativeHandle(ref, () => ({
    getLocation: async () => {
      return currentLocation
    }
  }))

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || isMapInitialized || leafletMapRef.current) return

    // Fix Leaflet icon issues
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    }

    const initialLat = initialLocation?.latitude || 40.7128
    const initialLng = initialLocation?.longitude || -74.006

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 10)
    leafletMapRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Add marker for current location
    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
    }).addTo(map)
    markerRef.current = marker

    // Update location when marker is dragged
    marker.on("dragend", async (e) => {
      const position = e.target.getLatLng()
      await handleLocationUpdate(position.lat, position.lng)
    })

    // Update location when map is clicked
    map.on("click", async (e) => {
      const position = e.latlng
      marker.setLatLng(position)
      await handleLocationUpdate(position.lat, position.lng)
    })

    // Get initial address if coordinates are provided
    if (initialLocation) {
      handleLocationUpdate(initialLocation.latitude, initialLocation.longitude)
    }

    setIsMapInitialized(true)

    // Cleanup function
    return () => {
      if (map && typeof window !== "undefined") {
        map.remove()
        leafletMapRef.current = null
        markerRef.current = null
        setIsMapInitialized(false)
      }
    }
  }, []) // Empty dependency array to run only once

  // Update marker position when initialLocation changes
  useEffect(() => {
    if (markerRef.current && initialLocation) {
      markerRef.current.setLatLng([initialLocation.latitude, initialLocation.longitude])
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([initialLocation.latitude, initialLocation.longitude], 10)
      }
    }
  }, [initialLocation])

  return (
    <div
      ref={mapRef}
      className="w-full h-[300px]"
      aria-label="Location picker map"
    />
  )
})

LocationPicker.displayName = "LocationPicker"

export default LocationPicker
