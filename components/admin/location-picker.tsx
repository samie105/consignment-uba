"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updatePackageLocation } from "@/server/actions/packageActions"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Save } from "lucide-react"

interface LocationPickerProps {
  tracking_number: string
  initialLocation?: {
    latitude: number
    longitude: number
    address: string
  }
}

export default function LocationPicker({ tracking_number, initialLocation }: LocationPickerProps) {
  const [location, setLocation] = useState({
    latitude: initialLocation?.latitude || 40.7128,
    longitude: initialLocation?.longitude || -74.006,
    address: initialLocation?.address || "New York, NY",
  })
  const [isSaving, setIsSaving] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    // Fix Leaflet icon issues
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    }

    // Initialize map if it doesn't exist
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([location.latitude, location.longitude], 10)

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMapRef.current)

      // Add marker for current location
      markerRef.current = L.marker([location.latitude, location.longitude], {
        draggable: true,
      }).addTo(leafletMapRef.current)

      // Update location when marker is dragged
      markerRef.current.on("dragend", (e) => {
        const marker = e.target
        const position = marker.getLatLng()
        setLocation((prev) => ({
          ...prev,
          latitude: position.lat,
          longitude: position.lng,
        }))
        reverseGeocode(position.lat, position.lng)
      })

      // Update location when map is clicked
      leafletMapRef.current.on("click", (e) => {
        const position = e.latlng
        if (markerRef.current) {
          markerRef.current.setLatLng(position)
        }
        setLocation((prev) => ({
          ...prev,
          latitude: position.lat,
          longitude: position.lng,
        }))
        reverseGeocode(position.lat, position.lng)
      })
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current && typeof window !== "undefined") {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Update marker position if location changes
  useEffect(() => {
    if (markerRef.current && leafletMapRef.current) {
      markerRef.current.setLatLng([location.latitude, location.longitude])
      leafletMapRef.current.setView([location.latitude, location.longitude], leafletMapRef.current.getZoom())
    }
  }, [location.latitude, location.longitude])

  // Simple reverse geocoding using Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()

      if (data && data.display_name) {
        setLocation((prev) => ({
          ...prev,
          address: data.display_name,
        }))
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
      // If geocoding fails, just use coordinates as address
      setLocation((prev) => ({
        ...prev,
        address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
      }))
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation((prev) => ({
      ...prev,
      address: e.target.value,
    }))
  }

  const handleSaveLocation = async () => {
    setIsSaving(true)
    try {
      const result = await updatePackageLocation(tracking_number, location)

      if (result.success) {
        toast.success("Location updated", {
          description: "The package location has been updated successfully.",
        })
      } else {
        toast.error("Error", {
          description: result.error || "Failed to update location. Please try again.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={mapRef}
        className="w-full h-[300px] rounded-lg border overflow-hidden"
        aria-label="Location picker map"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium mb-1">
            Latitude
          </label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            value={location.latitude}
            onChange={(e) => setLocation((prev) => ({ ...prev, latitude: Number.parseFloat(e.target.value) }))}
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium mb-1">
            Longitude
          </label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            value={location.longitude}
            onChange={(e) => setLocation((prev) => ({ ...prev, longitude: Number.parseFloat(e.target.value) }))}
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <Input id="address" value={location.address} onChange={handleAddressChange} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveLocation} disabled={isSaving}>
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Location
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
