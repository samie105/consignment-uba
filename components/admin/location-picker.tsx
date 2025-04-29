"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updatePackageLocation } from "@/server/actions/packageActions"

// Fix Leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Component to handle map clicks
function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number] | null
  setPosition: (pos: [number, number]) => void
}) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  return position ? <Marker position={position} icon={icon} /> : null
}

interface LocationPickerProps {
  trackingNumber: string
  initialLocation?: {
    lat: number
    lng: number
    address: string
  } | null
  onLocationUpdated?: () => void
}

export default function LocationPicker({
  trackingNumber,
  initialLocation = null,
  onLocationUpdated,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null,
  )
  const [address, setAddress] = useState(initialLocation?.address || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  // Fix for Leaflet marker icon in Next.js
  useEffect(() => {
    // Import Leaflet CSS
    import("leaflet/dist/leaflet.css")

    // Delete the default icon
    delete L.Icon.Default.prototype._getIconUrl

    // Set up the default icon
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    })
  }, [])

  // Function to handle location update
  const handleUpdateLocation = async () => {
    if (!position) {
      toast.error("Please select a location on the map")
      return
    }

    if (!address.trim()) {
      toast.error("Please enter an address")
      return
    }

    setIsUpdating(true)

    try {
      const result = await updatePackageLocation(trackingNumber, {
        lat: position[0],
        lng: position[1],
        address: address,
      })

      if (result.success) {
        toast.success("Package location updated")
        if (onLocationUpdated) {
          onLocationUpdated()
        }
      } else {
        toast.error(result.error || "Failed to update location")
      }
    } catch (error) {
      toast.error("An error occurred while updating the location")
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Function to search for an address using Nominatim (OpenStreetMap)
  const searchAddress = async () => {
    if (!address.trim()) {
      toast.error("Please enter an address to search")
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const location = data[0]
        const newPosition: [number, number] = [Number.parseFloat(location.lat), Number.parseFloat(location.lon)]
        setPosition(newPosition)

        // Center the map on the new position
        if (mapRef.current) {
          mapRef.current.setView(newPosition, 13)
        }
      } else {
        toast.error("Address not found")
      }
    } catch (error) {
      toast.error("Error searching for address")
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter location address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={searchAddress} variant="outline" type="button">
          Search
        </Button>
      </div>

      <div className="h-[400px] rounded-lg overflow-hidden border">
        <MapContainer
          center={position || [0, 0]}
          zoom={position ? 13 : 2}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {position
            ? `Selected: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
            : "Click on the map to select a location"}
        </p>
        <Button onClick={handleUpdateLocation} disabled={!position || !address.trim() || isUpdating}>
          {isUpdating ? "Updating..." : "Update Location"}
        </Button>
      </div>
    </div>
  )
}
