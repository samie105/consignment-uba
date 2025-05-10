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
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { addCheckpoint, deleteCheckpoint, updateCheckpoint } from "@/server/actions/packageActions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, Trash, Edit, X, Calendar, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { format, setHours, setMinutes } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Dynamically import the map component to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("@/components/admin/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-muted animate-pulse rounded-md" />,
})

interface CheckpointEditorProps {
  tracking_number: string
  onCheckpointAdded?: () => void
  allowCustomTime?: boolean
  initialCheckpoints?: Array<{
    id: string
    location: string
    description: string
    status: string
    timestamp: string
    customTime?: boolean
    customDate?: boolean
  }>
}

export function CheckpointEditor({
  tracking_number,
  onCheckpointAdded,
  allowCustomTime = false,
  initialCheckpoints = []
}: CheckpointEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const locationPickerRef = useRef<LocationPickerRef>(null)
  const [editMode, setEditMode] = useState<string | null>(null)
  const [checkpoints, setCheckpoints] = useState(initialCheckpoints)
  const [useCustomDate, setUseCustomDate] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("12:00")
  const [isAM, setIsAM] = useState<boolean>(true)

  const [checkpoint, setCheckpoint] = useState({
    location: "",
    description: "",
    status: "in_transit",
    customTime: false,
    customDate: false,
  })

  const [errors, setErrors] = useState({
    location: false,
    description: false,
  })

  const handleLocationChange = (location: LocationUpdateEvent) => {
    setCheckpoint(prev => ({
      ...prev,
      location: location.address
    }))
    setErrors(prev => ({
      ...prev,
      location: false
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
        customTime: checkpointToEdit.customTime || false,
        customDate: checkpointToEdit.customDate || false,
      })
      setEditMode(id)
      if (checkpointToEdit.customDate) {
        setSelectedDate(new Date(checkpointToEdit.timestamp))
        setUseCustomDate(true)
      }
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Validate fields
    const locationError = !checkpoint.location.trim()
    const descriptionError = !checkpoint.description.trim()

    setErrors({
      location: locationError,
      description: descriptionError,
    })

    if (locationError || descriptionError) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      let timestamp = new Date()
      if (useCustomDate && selectedDate) {
        const [hours, minutes] = selectedTime.split(":").map(Number)
        const adjustedHours = isAM ? hours : hours + 12
        timestamp = setMinutes(setHours(selectedDate, adjustedHours), minutes)
      }

      const checkpointData = {
        ...checkpoint,
        timestamp: timestamp.toISOString(),
        customTime: useCustomDate,
        customDate: useCustomDate,
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
          toast.success("Checkpoint updated successfully")
          setEditMode(null)
        } else {
          throw new Error((result as { error?: string }).error || "Failed to update checkpoint")
        }
      } else {
        result = await addCheckpoint(tracking_number, checkpointData)
        if (result.success) {
          const newCheckpoint = { 
            ...checkpointData, 
            id: (result as any).checkpoint?.id || crypto.randomUUID()
          }
          setCheckpoints(prev => [...prev, newCheckpoint])
          toast.success("Checkpoint added successfully")
        } else {
          throw new Error((result as { error?: string }).error || "Failed to add checkpoint")
        }
      }

      // Reset form
      setCheckpoint({
        location: "",
        description: "",
        status: "in_transit",
        customTime: false,
        customDate: false,
      })
      setUseCustomDate(false)
      setSelectedDate(new Date())
      setSelectedTime("12:00")
      setIsAM(true)
      setShowMap(false)

      if (onCheckpointAdded) {
        onCheckpointAdded()
      }
    } catch (error) {
      console.error("Error submitting checkpoint:", error)
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred")
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
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="e.g., Sorting Facility, New York"
                  value={checkpoint.location}
                  onChange={(e) => {
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
                  }}
                  className={errors.location ? "border-destructive" : ""}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {errors.location && <p className="text-sm text-destructive mt-1">Location is required</p>}
            </div>

            {showMap && (
              <div className="rounded-md overflow-hidden border">
                <LocationPicker 
                  ref={locationPickerRef}
                  onLocationChange={handleLocationChange}
                />
              </div>
            )}

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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="custom-date"
                  checked={useCustomDate}
                  onCheckedChange={setUseCustomDate}
                />
                <label htmlFor="custom-date" className="text-sm font-medium">
                  Use custom date and time
                </label>
              </div>
              {!useCustomDate && (
                <p className="text-sm text-muted-foreground">
                  Date and time will be set automatically to current time
                </p>
              )}
            </div>

            {useCustomDate && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Time
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={isAM ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsAM(true)}
                        >
                          AM
                        </Button>
                        <Button
                          variant={!isAM ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsAM(false)}
                        >
                          PM
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                      customTime: false,
                      customDate: false,
                    })
                    setUseCustomDate(false)
                    setSelectedDate(new Date())
                    setSelectedTime("12:00")
                    setIsAM(true)
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
