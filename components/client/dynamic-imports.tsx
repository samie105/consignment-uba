"use client"

import dynamic from "next/dynamic"

// Export dynamic components from this client component
export const DynamicLocationPicker = dynamic(() => import("@/components/admin/location-picker"), { ssr: false })

export const DynamicRealPackageMap = dynamic(() => import("@/components/map/real-package-map"), { ssr: false })
