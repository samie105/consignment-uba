"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface Coordinates {
  lat: number
  lng: number
}

interface Checkpoint {
  id: string
  status: string
  location: string
  timestamp: string
  details: string
  isCompleted: boolean
  coordinates: Coordinates
}

interface MapPackageData {
  tracking_number: string
  status: string
  statusText: string
  current_location: {
    address: string
    latitude: number
    longitude: number
  }
}

interface RealPackageMapProps {
  packageData: MapPackageData
  checkpoints?: Checkpoint[]
  height?: string
  showCheckpoints?: boolean
}

export default function RealPackageMap({
  packageData,
  checkpoints = [],
  height = "400px",
  showCheckpoints = false,
}: RealPackageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Fix Leaflet icon issues
    if (typeof window !== "undefined") {
      // Fix Leaflet's default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    }

    // Initialize map if it doesn't exist
    if (mapRef.current && !leafletMapRef.current) {
      // Default coordinates if current_location is null or has invalid coordinates
      const defaultCoordinates: [number, number] = [0, 0]
      let coordinates = defaultCoordinates
      
      if (packageData.current_location && 
          typeof packageData.current_location.latitude === 'number' && 
          typeof packageData.current_location.longitude === 'number') {
        coordinates = [packageData.current_location.latitude, packageData.current_location.longitude]
      }
      
      leafletMapRef.current = L.map(mapRef.current).setView(coordinates, 5)

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMapRef.current)
    }

    // Update map with current package location
    if (leafletMapRef.current) {
      const map = leafletMapRef.current

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer)
        }
      })

      // Add current location marker with custom icon if we have valid coordinates
      if (packageData.current_location && 
          typeof packageData.current_location.latitude === 'number' && 
          typeof packageData.current_location.longitude === 'number') {
        const currentLocationIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const currentMarker = L.marker([packageData.current_location.latitude, packageData.current_location.longitude], {
          icon: currentLocationIcon,
        })
          .addTo(map)
          .bindPopup(`<b>Current Location</b><br>${packageData.current_location.address || "Unknown location"}`)
      }

      // Add checkpoint markers and path if showCheckpoints is true
      if (showCheckpoints && checkpoints.length > 0) {
        // Create a path of all checkpoints
        const checkpointCoordinates = checkpoints
          .filter((cp) => cp.coordinates && cp.coordinates.lat && cp.coordinates.lng)
          .map((cp) => [cp.coordinates.lat, cp.coordinates.lng] as [number, number])

        // Add the current location to the path if it exists
        if (packageData.current_location && 
            typeof packageData.current_location.latitude === 'number' && 
            typeof packageData.current_location.longitude === 'number') {
          checkpointCoordinates.push([packageData.current_location.latitude, packageData.current_location.longitude])
        }

        // Create a polyline for the path
        if (checkpointCoordinates.length > 1) {
          const path = L.polyline(checkpointCoordinates, {
            color: "#3b82f6",
            weight: 3,
            opacity: 0.7,
            dashArray: "5, 10",
          }).addTo(map)

          // Add checkpoint markers
          checkpoints.forEach((checkpoint, index) => {
            if (checkpoint.coordinates && checkpoint.coordinates.lat && checkpoint.coordinates.lng) {
              // Determine if this is the last checkpoint
              const isLastCheckpoint = index === 0;
              
              // Determine icon style based on status and whether it's the last checkpoint
              let iconHtml;
              if (isLastCheckpoint) {
                // Pulsing location icon for the last checkpoint
                iconHtml = `<div style="position: relative;">
                  <div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; z-index: 1;"></div>
                  <div style="position: absolute; top: -5px; left: -5px; background-color: rgba(59, 130, 246, 0.5); width: 26px; height: 26px; border-radius: 50%; animation: pulse 1.5s infinite; z-index: 0;"></div>
                </div>`;
              } else if (checkpoint.status === "delivered" || checkpoint.status === "arrived") {
                // Check icon for delivered or arrived checkpoints
                iconHtml = `<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>`;
              } else {
                // Location icon for other checkpoints
                iconHtml = `<div style="background-color: #9ca3af; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></div>`;
              }

              const checkpointIcon = L.divIcon({
                className: "custom-div-icon",
                html: iconHtml,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });

              L.marker([checkpoint.coordinates.lat, checkpoint.coordinates.lng], { icon: checkpointIcon })
                .addTo(map)
                .bindPopup(`
                  <b>${checkpoint.status}</b><br>
                  ${checkpoint.location}<br>
                  <small>${new Date(checkpoint.timestamp).toLocaleString()}</small><br>
                  ${checkpoint.details || ''}
                `)
            }
          })

          // Fit the map to show all markers
          map.fitBounds(path.getBounds(), { padding: [30, 30] })
        } else {
          // If there's only one point, center on it
          if (packageData.current_location && 
              typeof packageData.current_location.latitude === 'number' && 
              typeof packageData.current_location.longitude === 'number') {
            map.setView([packageData.current_location.latitude, packageData.current_location.longitude], 10)
          } else {
            // Default view if no valid coordinates
            map.setView([0, 0], 2)
          }
        }
      } else {
        // If not showing checkpoints, just center on current location if it exists
        if (packageData.current_location && 
            typeof packageData.current_location.latitude === 'number' && 
            typeof packageData.current_location.longitude === 'number') {
          map.setView([packageData.current_location.latitude, packageData.current_location.longitude], 10)
        } else {
          // Default view if no valid coordinates
          map.setView([0, 0], 2)
        }
      }
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current && typeof window !== "undefined") {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [packageData, checkpoints, showCheckpoints])

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
      `}</style>
      <div
        ref={mapRef}
        className="w-full rounded-lg border overflow-hidden"
        style={{ height }}
        aria-label="Package location map"
      />
    </>
  )
}
