"use client"

import type React from "react"
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, MapPin } from "lucide-react"
import { updatePackageLocation } from "@/server/actions/packageActions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export interface LocationUpdateEvent {
  lat: number
  lng: number
  address: string
}

export interface LocationPickerRef {
  getLocation: () => Promise<LocationUpdateEvent | null>
}

interface LocationPickerProps {
  onLocationChange: (location: LocationUpdateEvent) => void
  initialLocation?: {
    latitude: number
    longitude: number
    address?: string
  }
  tracking_number?: string
}

const LocationPicker = forwardRef<LocationPickerRef, LocationPickerProps>(
  ({ initialLocation, tracking_number, onLocationChange }, ref) => {
    const router = useRouter()
    const mapRef = useRef<HTMLDivElement>(null)
    const leafletMapRef = useRef<L.Map | null>(null)
    const markerRef = useRef<L.Marker | null>(null)
    const [isMapInitialized, setIsMapInitialized] = useState(false)
    const [currentLocation, setCurrentLocation] = useState<LocationUpdateEvent | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [address, setAddress] = useState(initialLocation?.address || "")
    const [isGeocoding, setIsGeocoding] = useState(false)
    const [coordinates, setCoordinates] = useState<[number, number]>(
      initialLocation?.latitude && initialLocation?.longitude
        ? [initialLocation.latitude, initialLocation.longitude]
        : [0, 0] // Default coordinates
    )

    const getCoordinatesFromAddress = async (address: string) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        )
        const data = await response.json()
        if (data && data[0]) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display_name: data[0].display_name
          }
        }
        return null
      } catch (error) {
        console.error("Error geocoding address:", error)
        return null
      }
    }

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

    const handleLocationUpdate = async (lat: number, lng: number, manualAddress?: string) => {
      let finalAddress = manualAddress
      
      // Only try to get address from coordinates if no manual address is provided
      if (!finalAddress) {
        finalAddress = await getAddressFromCoordinates(lat, lng)
      }
      
      // Ensure address is always a string
      const addressString = finalAddress || "Unknown location"
      
      const location = { lat, lng, address: addressString }
      setCurrentLocation(location)
      setAddress(addressString)
      if (onLocationChange) {
        onLocationChange(location)
      }
      return location
    }

    const handleAddressChange = (newAddress: string) => {
      setAddress(newAddress)
      
      // Update current location with manual address if coordinates exist
      if (currentLocation) {
        const updatedLocation = {
          ...currentLocation,
          address: newAddress
        }
        setCurrentLocation(updatedLocation)
        if (onLocationChange) {
          onLocationChange(updatedLocation)
        }
      }
    }

    const handleGeocodeAddress = async () => {
      if (!address.trim()) return

      setIsGeocoding(true)
      const location = await getCoordinatesFromAddress(address)
      setIsGeocoding(false)

      if (location && markerRef.current && leafletMapRef.current) {
        const { lat, lng, display_name } = location
        markerRef.current.setLatLng([lat, lng])
        leafletMapRef.current.setView([lat, lng], 13)
        await handleLocationUpdate(lat, lng, display_name)
        setAddress(display_name)
      } else {
        // If geocoding fails, still allow saving with manual address
        if (currentLocation) {
          await handleLocationUpdate(currentLocation.lat, currentLocation.lng, address)
        } else {
          // Create a location with default coordinates but manual address
          const defaultLocation = { lat: 0, lng: 0, address }
          setCurrentLocation(defaultLocation)
          if (onLocationChange) {
            onLocationChange(defaultLocation)
          }
        }
      }
    }

    const handleSaveLocation = async () => {
      // Allow saving even if we only have an address without coordinates
      const locationToSave = currentLocation || { lat: 0, lng: 0, address }
      
      if (!tracking_number) return

      setIsUpdating(true)
      try {
        const result = await updatePackageLocation(tracking_number, {
          latitude: locationToSave.lat,
          longitude: locationToSave.lng,
          address: locationToSave.address || address
        })

        if (result.success) {
          toast.success("Location updated", {
            description: "The package location has been updated successfully."
          })
          router.refresh()
        } else {
          toast.error("Error", {
            description: result.error || "Failed to update location. Please try again."
          })
        }
      } catch (error) {
        toast.error("Error", {
          description: "An unexpected error occurred. Please try again."
        })
      } finally {
        setIsUpdating(false)
      }
    }

    useImperativeHandle(ref, () => ({
      getLocation: async () => {
        return currentLocation || { lat: 0, lng: 0, address }
      }
    }))

    useEffect(() => {
      if (!mapRef.current || isMapInitialized || leafletMapRef.current) return

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

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
      }).addTo(map)
      markerRef.current = marker

      marker.on("dragend", async (e) => {
        const position = e.target.getLatLng()
        await handleLocationUpdate(position.lat, position.lng)
      })

      map.on("click", async (e) => {
        const position = e.latlng
        marker.setLatLng(position)
        await handleLocationUpdate(position.lat, position.lng)
      })

      if (initialLocation) {
        handleLocationUpdate(initialLocation.latitude, initialLocation.longitude, initialLocation.address)
      }

      setIsMapInitialized(true)

      return () => {
        if (map && typeof window !== "undefined") {
          map.remove()
          leafletMapRef.current = null
          markerRef.current = null
          setIsMapInitialized(false)
        }
      }
    }, [])

    useEffect(() => {
      if (markerRef.current && initialLocation) {
        markerRef.current.setLatLng([initialLocation.latitude, initialLocation.longitude])
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([initialLocation.latitude, initialLocation.longitude], 10)
        }
      }
    }, [initialLocation])

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Enter location manually or use map"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGeocodeAddress}
            disabled={isGeocoding || !address.trim()}
            title="Find location on map"
          >
            <MapPin className="h-4 w-4" />
          </Button>
          {tracking_number && (
            <Button 
              onClick={handleSaveLocation} 
              disabled={isUpdating || (!currentLocation && !address.trim())}
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Save Location"}
            </Button>
          )}
        </div>
        <div
          ref={mapRef}
          className="w-full h-[300px] rounded-md border"
          aria-label="Location picker map"
        />
      </div>
    )
  }
)

LocationPicker.displayName = "LocationPicker"

export default LocationPicker
