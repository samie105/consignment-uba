"use client"

import type React from "react"
import { useRef } from "react"
import type { LocationPickerRef } from "./location-picker"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { addCheckpoint } from "@/server/actions/packageActions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("@/components/admin/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-muted animate-pulse rounded-md" />,
})

interface CheckpointEditorProps {
  tracking_number: string
  onCheckpointAdded?: () => void
}

export function CheckpointEditor({ tracking_number, onCheckpointAdded }: CheckpointEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const locationPickerRef = useRef<LocationPickerRef>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const [checkpoint, setCheckpoint] = useState({
    location: "",
    description: "",
    status: "in_transit",
    coordinates: null as { lat: number; lng: number } | null,
  })
  const [errors, setErrors] = useState({
    location: false,
    description: false,
    coordinates: false,
  })

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Get location from the map if it's shown
    if (showMap) {
      const location = await locationPickerRef.current?.getLocation()
      if (location) {
        setCheckpoint(prev => ({
          ...prev,
          location: location.address,
          coordinates: { lat: location.lat, lng: location.lng }
        }))
      }
    }

    // Validate fields
    const locationError = !checkpoint.location.trim()
    const descriptionError = !checkpoint.description.trim()
    const coordinatesError = !checkpoint.coordinates

    setErrors({
      location: locationError,
      description: descriptionError,
      coordinates: coordinatesError,
    })

    if (locationError || descriptionError || coordinatesError) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addCheckpoint(tracking_number, {
        ...checkpoint,
        timestamp: new Date().toISOString(),
      })

      if (result.success) {
        toast.success("Checkpoint added", {
          description: "The checkpoint has been added to the package.",
        })

        // Reset form
        setCheckpoint({
          location: "",
          description: "",
          status: "in_transit",
          coordinates: null,
        })

        setShowMap(false)

        if (onCheckpointAdded) {
          onCheckpointAdded()
        }

        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "Failed to add checkpoint. Please try again.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const location = e.target.value
    setCheckpoint(prev => ({
      ...prev,
      location
    }))
    if (location.trim()) {
      setErrors(prev => ({
        ...prev,
        location: false
      }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Checkpoint</CardTitle>
        <CardDescription>Add a new tracking checkpoint for this package</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              placeholder="e.g., Sorting Facility, New York"
              value={checkpoint.location}
              onChange={handleLocationChange}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && <p className="text-sm text-destructive mt-1">Location is required</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="e.g., Package received at sorting facility"
              value={checkpoint.description}
              onChange={(e) => {
                setCheckpoint({ ...checkpoint, description: e.target.value })
                if (e.target.value.trim()) {
                  setErrors({ ...errors, description: false })
                }
              }}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">Description is required</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <Select
              value={checkpoint.status}
              onValueChange={(value) => setCheckpoint({ ...checkpoint, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="exception">Exception</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div>
              <Button type="button" variant="outline" className="w-full" onClick={() => setShowMap(!showMap)}>
                <MapPin className="mr-2 h-4 w-4" />
                {showMap ? "Hide Map" : "Set Location on Map"}
              </Button>
            </div>

            {showMap && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Click on the map to set the checkpoint location</p>
                <div className="rounded-md overflow-hidden border">
                  <LocationPicker 
                    ref={locationPickerRef}
                    initialLocation={checkpoint.coordinates ? {
                      latitude: checkpoint.coordinates.lat,
                      longitude: checkpoint.coordinates.lng
                    } : undefined}
                  />
                </div>
                {errors.coordinates && (
                  <p className="text-sm text-destructive mt-1">Location coordinates are required</p>
                )}
              </div>
            )}
          </div>

          <Button 
            type="button" 
            className="w-full" 
            disabled={isSubmitting}
            onClick={() => handleSubmit()}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Checkpoint"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
