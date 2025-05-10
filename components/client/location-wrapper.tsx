"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { LocationUpdateEvent } from "@/components/admin/location-picker"

// Dynamically import the LocationPicker
const LocationPicker = dynamic(() => import("@/components/admin/location-picker"), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-muted/20 rounded-md animate-pulse" />
})

// Create a wrapper component that handles the function prop internally
export function DynamicLocationPickerWrapper({
  initialLocation,
  tracking_number,
}: {
  initialLocation?: {
    latitude: number
    longitude: number
    address?: string
  }
  tracking_number?: string
}) {
  // Handle location changes internally in this client component
  const handleLocationChange = (location: LocationUpdateEvent) => {
    console.log("Location updated:", location)
    // You can also make API calls or update state here
  }

  return (
    <LocationPicker
      initialLocation={initialLocation}
      tracking_number={tracking_number}
      onLocationChange={handleLocationChange}
    />
  )
} 