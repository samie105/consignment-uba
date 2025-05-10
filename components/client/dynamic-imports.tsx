"use client"

import dynamic from "next/dynamic"

// Dynamically import the components with ssr: false
const LocationPicker = dynamic(() => import("@/components/admin/location-picker"), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-muted/20 rounded-md animate-pulse" />
})

const RealPackageMap = dynamic(() => import("@/components/map/real-package-map"), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-muted/20 rounded-md animate-pulse" />
})

// Re-export the components directly
export const DynamicLocationPicker = LocationPicker
export const DynamicRealPackageMap = RealPackageMap
