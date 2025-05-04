"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import type { LocationPickerRef, LocationUpdateEvent } from "./location-picker"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { addCheckpoint, deleteCheckpoint, updateCheckpoint } from "@/server/actions/packageActions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, Trash, Edit, X } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("@/components/admin/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-muted animate-pulse rounded-md" />,
})

interface CheckpointEditorProps {
  tracking_number: string
  onCheckpointAdded?: () => void
  initialCheckpoints?: Array<{
    id: string
    location: string
    description: string
    status: string
    coordinates?: { lat: number; lng: number } | null
    timestamp: string
  }>
}

export function CheckpointEditor({ tracking_number, onCheckpointAdded, initialCheckpoints = [] }: CheckpointEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const locationPickerRef = useRef<LocationPickerRef>(null)
  const [editMode, setEditMode] = useState<string | null>(null)
  const [checkpoints, setCheckpoints] = useState(initialCheckpoints)

  const [checkpoint, setCheckpoint] = useState({
    location: "",
    description: "",
    status: "in_transit",
    coordinates: null as { lat: number; lng: number } | null,
    address: "",
  })
  const [errors, setErrors] = useState({
    location: false,
    description: false,
    coordinates: false,
  })

  const handleLocationChange = (location: LocationUpdateEvent) => {
    setCheckpoint(prev => ({
      ...prev,
      location: location.address,
      coordinates: { lat: location.lat, lng: location.lng },
      address: location.address
    }))
    setErrors(prev => ({
      ...prev,
      location: false,
      coordinates: false
    }))
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCheckpoint(tracking_number, id)
      if (result.success) {
        setCheckpoints(prev => prev.filter(cp => cp.id !== id))
        toast.success("Checkpoint deleted successfully")
      } else {
        toast.error("Failed to delete checkpoint")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the checkpoint")
    }
  }

  const handleEdit = (id: string) => {
    const checkpointToEdit = checkpoints.find(cp => cp.id === id)
    if (checkpointToEdit) {
      setCheckpoint({
        location: checkpointToEdit.location,
        description: checkpointToEdit.description,
        status: checkpointToEdit.status,
        coordinates: checkpointToEdit.coordinates || null,
        address: checkpointToEdit.location,
      })
      setEditMode(id)
      setShowMap(true)
    }
  }

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
          coordinates: { lat: location.lat, lng: location.lng },
          address: location.address
        }))
      }
    }

    // Validate fields
    const locationError = !checkpoint.location.trim()
    const descriptionError = !checkpoint.description.trim()
    const coordinatesError = showMap && !checkpoint.coordinates

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
      const checkpointData = {
        ...checkpoint,
        timestamp: new Date().toISOString(),
      }

      let result;
      if (editMode) {
        result = await updateCheckpoint(tracking_number, editMode, checkpointData)
        if (result.success) {
          setCheckpoints(prev => prev.map(cp => 
            cp.id === editMode 
              ? { ...cp, ...checkpointData, id: editMode }
              : cp
          ))
          toast.success("Checkpoint updated", {
            description: "The checkpoint has been updated successfully."
          })
          setEditMode(null)
        }
      } else {
        result = await addCheckpoint(tracking_number, checkpointData)
        if (result.success) {
          const newCheckpoint = { 
            ...checkpointData, 
            id: (result as any).checkpoint?.id || crypto.randomUUID()
          }
          setCheckpoints(prev => [...prev, newCheckpoint])
          toast.success("Checkpoint added", {
            description: "The checkpoint has been added to the package."
          })
        }
      }

      if (result.success) {
        // Reset form
        setCheckpoint({
          location: "",
          description: "",
          status: "in_transit",
          coordinates: null,
          address: "",
        })
        setShowMap(false)

        if (onCheckpointAdded) {
          onCheckpointAdded()
        }
      } else {
        toast.error("Error", {
          description: result.error || `Failed to ${editMode ? 'update' : 'add'} checkpoint. Please try again.`,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editMode ? "Edit Checkpoint" : "Add Checkpoint"}</CardTitle>
          <CardDescription>
            {editMode ? "Update the checkpoint information" : "Add a new tracking checkpoint for this package"}
          </CardDescription>
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
                onChange={(e) => {
                  const location = e.target.value
                  setCheckpoint(prev => ({
                    ...prev,
                    location,
                    address: location
                  }))
                  if (location.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      location: false
                    }))
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
                  <SelectItem value="in_warehouse">In Warehouse</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="customs_check">Customs Check</SelectItem>
                  <SelectItem value="customs_hold">Customs Hold</SelectItem>
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
                      onLocationChange={handleLocationChange}
                    />
                  </div>
                  {errors.coordinates && (
                    <p className="text-sm text-destructive mt-1">Location coordinates are required</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {editMode && (
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1" 
                  onClick={() => {
                    setEditMode(null)
                    setCheckpoint({
                      location: "",
                      description: "",
                      status: "in_transit",
                      coordinates: null,
                      address: "",
                    })
                    setShowMap(false)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Edit
                </Button>
              )}
              <Button 
                type="button" 
                className="flex-1" 
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
              >
                {editMode ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Updating..." : "Update Checkpoint"}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Adding..." : "Add Checkpoint"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {checkpoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Checkpoints</CardTitle>
            <CardDescription>View and manage package checkpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkpoints.map((cp) => (
                <Card key={cp.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{cp.location}</p>
                        <p className="text-sm text-muted-foreground">{cp.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(cp.timestamp).toLocaleString()}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {cp.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {e.preventDefault();handleEdit(cp.id)}}
                          title="Edit checkpoint"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {e.preventDefault();handleDelete(cp.id)}}
                          className="text-destructive"
                          title="Delete checkpoint"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
