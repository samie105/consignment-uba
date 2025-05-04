"use client"

import type React from "react"

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
  const [checkpoint, setCheckpoint] = useState({
    location: "",
    description: "",
    status: "in_transit",
    coordinates: null as { lat: number; lng: number } | null,
  })
  const [errors, setErrors] = useState({
    location: false,
    description: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate fields
    const locationError = !checkpoint.location.trim()
    const descriptionError = !checkpoint.description.trim()

    setErrors({
      location: locationError,
      description: descriptionError,
    })

    if (locationError || descriptionError) {
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

        // Callback
        if (onCheckpointAdded) {
          onCheckpointAdded()
        }

        // Refresh the page
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

  const handleCoordinatesSelected = (lat: number, lng: number) => {
    setCheckpoint({
      ...checkpoint,
      coordinates: { lat, lng },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Checkpoint</CardTitle>
        <CardDescription>Add a new tracking checkpoint for this package</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              placeholder="e.g., Sorting Facility, New York"
              value={checkpoint.location}
              onChange={(e) => {
                setCheckpoint({ ...checkpoint, location: e.target.value })
                if (e.target.value.trim()) {
                  setErrors({ ...errors, location: false })
                }
              }}
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

          <div>
            <Button type="button" variant="outline" className="w-full" onClick={() => setShowMap(!showMap)}>
              <MapPin className="mr-2 h-4 w-4" />
              {showMap ? "Hide Map" : "Set Location on Map"}
            </Button>
          </div>

          {showMap && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Click on the map to set the checkpoint location</p>
              <div className="h-[300px] rounded-md overflow-hidden border">
                {/* Map component will be loaded here */}
                <div className="h-full bg-muted flex items-center justify-center">
                  <p>Map loading...</p>
                </div>
              </div>
              {checkpoint.coordinates && (
                <p className="text-xs text-muted-foreground mt-2">
                  Selected coordinates: {checkpoint.coordinates.lat.toFixed(6)}, {checkpoint.coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Checkpoint"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
