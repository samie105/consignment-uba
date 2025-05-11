"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

// Define the checkpoint type
export interface Checkpoint {
  id: string
  location: string
  description: string
  status: string
  timestamp: string
  customTime?: boolean
  customDate?: boolean
  coordinates?: {
    latitude?: number
    longitude?: number
    lat?: number
    lng?: number
  } | null
}

// Storage key for localStorage
const STORAGE_KEY = 'deliveryone_checkpoints'

// Define the context shape
interface CheckpointsContextType {
  checkpointsByTrackingNumber: Record<string, Checkpoint[]>
  getCheckpoints: (trackingNumber: string) => Checkpoint[]
  updateCheckpoints: (trackingNumber: string, checkpoints: Checkpoint[]) => void
  clearCheckpoints: (trackingNumber: string) => void
}

// Create context with default values
const CheckpointsContext = createContext<CheckpointsContextType>({
  checkpointsByTrackingNumber: {},
  getCheckpoints: () => [],
  updateCheckpoints: () => {},
  clearCheckpoints: () => {},
})

// Hook for easy context usage
export const useCheckpoints = () => useContext(CheckpointsContext)

// Helper function to safely get data from localStorage
const getStoredCheckpoints = (): Record<string, Checkpoint[]> => {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to parse stored checkpoints:', error)
    return {}
  }
}

// Context provider component
export function CheckpointsProvider({ children }: { children: ReactNode }) {
  // State to store checkpoints by tracking number
  const [checkpointsByTrackingNumber, setCheckpointsByTrackingNumber] = useState<Record<string, Checkpoint[]>>({})
  
  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = getStoredCheckpoints()
    if (Object.keys(storedData).length > 0) {
      setCheckpointsByTrackingNumber(storedData)
    }
  }, [])
  
  // Save to localStorage when state changes
  useEffect(() => {
    if (Object.keys(checkpointsByTrackingNumber).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkpointsByTrackingNumber))
    }
  }, [checkpointsByTrackingNumber])

  // Get checkpoints for a specific tracking number
  const getCheckpoints = (trackingNumber: string): Checkpoint[] => {
    return checkpointsByTrackingNumber[trackingNumber] || []
  }

  // Update checkpoints for a specific tracking number
  const updateCheckpoints = (trackingNumber: string, checkpoints: Checkpoint[]) => {
    if (!trackingNumber || trackingNumber === 'preview' || trackingNumber === 'edit-preview' || trackingNumber === 'new') {
      return
    }
    
    setCheckpointsByTrackingNumber(prev => ({
      ...prev,
      [trackingNumber]: checkpoints,
    }))
  }

  // Clear checkpoints for a specific tracking number
  const clearCheckpoints = (trackingNumber: string) => {
    setCheckpointsByTrackingNumber(prev => {
      const newState = { ...prev }
      delete newState[trackingNumber]
      return newState
    })
  }

  return (
    <CheckpointsContext.Provider
      value={{
        checkpointsByTrackingNumber,
        getCheckpoints,
        updateCheckpoints,
        clearCheckpoints,
      }}
    >
      {children}
    </CheckpointsContext.Provider>
  )
} 