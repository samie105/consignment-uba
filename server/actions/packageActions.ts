"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"

// Helper function to check if Supabase is configured
const checkSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      error:
        "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    }
  }

  return { success: true }
}

// Helper function to get the current admin ID from cookies
const getCurrentAdminId = () => {
  try {
    const cookieStore = cookies()
    const adminData = cookieStore.get("admin")

    if (!adminData || !adminData.value) {
      return null
    }

    const parsedData = JSON.parse(adminData.value)
    return parsedData.id || null
  } catch (error) {
    console.error("Error getting admin ID from cookies:", error)
    return null
  }
}

// Helper function to generate a random tracking number
function generateTrackingNumber() {
  return `DU${Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, "0")}`
}

// Create a new package
export async function createPackage(data: any) {
  try {
    const supabase = createClient()

    // Generate a tracking number
    const trackingNumber = generateTrackingNumber()

    // Get the current admin ID
    const adminId = getCurrentAdminId()

    // Add current location if not provided
    if (!data.current_location) {
      data.current_location = {
        latitude: 40.7128,
        longitude: -74.006,
        address: "New York, NY",
      }
    }

    // Insert the package into the database
    const { data: packageData, error } = await supabase
      .from("packages")
      .insert({
        tracking_number: trackingNumber,
        status: data.status,
        description: data.description,
        weight: data.weight,
        dimensions: data.dimensions,
        sender: data.sender,
        recipient: data.recipient,
        payment: data.payment,
        images: data.images || [],
        checkpoints: data.checkpoints || [],
        current_location: data.current_location,
        admin_id: adminId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating package:", error)
      return { success: false, error: error.message }
    }

    // Use revalidatePath only in app directory components
    try {
      revalidatePath("/admin/packages")
    } catch (e) {
      // Silently catch errors if revalidatePath is not supported
      console.log("Note: revalidatePath not supported in this context")
    }

    return {
      success: true,
      trackingNumber,
      package: packageData,
    }
  } catch (error: any) {
    console.error("Unexpected error creating package:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Get all packages
export async function getAllPackages() {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return { success: false, error: configCheck.error, packages: [] }
    }

    const supabase = createClient()

    // Get the current admin ID
    const adminId = getCurrentAdminId()

    let query = supabase.from("packages").select("*")

    // If admin ID is available, filter by admin
    if (adminId) {
      query = query.eq("admin_id", adminId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching packages:", error)
      return { success: false, error: error.message, packages: [] }
    }

    return { success: true, packages: data, error: null }
  } catch (error: any) {
    console.error("Error fetching packages:", error)
    return { success: false, error: error.message, packages: [] }
  }
}

// Get a package by ID
export async function getPackageById(id: string) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return { success: false, error: configCheck.error }
    }

    const supabase = createClient()
    const { data, error } = await supabase.from("packages").select("*").eq("tracking_number", id).single()

    if (error) {
      console.error("Error fetching package:", error)
      return { success: false, error: error.message }
    }

    return { success: true, package: data }
  } catch (error: any) {
    console.error("Error fetching package:", error)
    return { success: false, error: error.message }
  }
}

// Update a package
export async function updatePackage(trackingNumber: string, packageData: any) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    const supabase = createClient()

    // Prepare the package data
    const updatedPackage = {
      status: packageData.status,
      description: packageData.description,
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      sender: packageData.sender,
      recipient: packageData.recipient,
      payment: packageData.payment,
      images: packageData.images || [],
    }

    // Update the package in the database
    const { error } = await supabase.from("packages").update(updatedPackage).eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error updating package:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the package page
    revalidatePath(`/admin/packages/${trackingNumber}`)
    revalidatePath("/admin/packages")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating package:", error)
    return { success: false, error: error.message }
  }
}

// Delete a package
export async function deletePackage(trackingNumber: string) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    const supabase = createClient()

    // Delete the package from the database
    const { error } = await supabase.from("packages").delete().eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error deleting package:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the packages page
    revalidatePath("/admin/packages")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting package:", error)
    return { success: false, error: error.message }
  }
}

// Add a checkpoint to a package
export async function addCheckpoint(trackingNumber: string, checkpointData: any) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    const supabase = createClient()

    // Get the current package
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("checkpoints")
      .eq("tracking_number", trackingNumber)
      .single()

    if (packageError) {
      console.error("Error fetching package:", packageError)
      return { success: false, error: packageError.message }
    }

    // Prepare the checkpoint data
    const newCheckpoint = {
      id: checkpointData.id || uuidv4(),
      location: checkpointData.location,
      description: checkpointData.description,
      timestamp: checkpointData.timestamp || new Date().toISOString(),
      status: checkpointData.status,
      coordinates: checkpointData.coordinates || null,
    }

    // Add the checkpoint to the package
    const checkpoints = [...(packageData.checkpoints || []), newCheckpoint]

    // Update the package in the database
    const { error } = await supabase
      .from("packages")
      .update({ checkpoints, status: checkpointData.status })
      .eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error adding checkpoint:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the package page
    revalidatePath(`/admin/packages/${trackingNumber}`)
    revalidatePath("/admin/packages")

    return { success: true, checkpoint: newCheckpoint }
  } catch (error: any) {
    console.error("Error adding checkpoint:", error)
    return { success: false, error: error.message }
  }
}

// Update a checkpoint
export async function updateCheckpoint(trackingNumber: string, checkpointId: string, checkpointData: any) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    const supabase = createClient()

    // Get the current package
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("checkpoints")
      .eq("tracking_number", trackingNumber)
      .single()

    if (packageError) {
      console.error("Error fetching package:", packageError)
      return { success: false, error: packageError.message }
    }

    // Find the checkpoint to update
    const checkpoints = packageData.checkpoints || []
    const checkpointIndex = checkpoints.findIndex((checkpoint: any) => checkpoint.id === checkpointId)

    if (checkpointIndex === -1) {
      return { success: false, error: "Checkpoint not found" }
    }

    // Update the checkpoint
    checkpoints[checkpointIndex] = {
      ...checkpoints[checkpointIndex],
      ...checkpointData,
    }

    // Update the package in the database
    const { error } = await supabase.from("packages").update({ checkpoints }).eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error updating checkpoint:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the package page
    revalidatePath(`/admin/packages/${trackingNumber}`)
    revalidatePath("/admin/packages")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating checkpoint:", error)
    return { success: false, error: error.message }
  }
}

// Delete a checkpoint
export async function deleteCheckpoint(trackingNumber: string, checkpointId: string) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    const supabase = createClient()

    // Get the current package
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("checkpoints")
      .eq("tracking_number", trackingNumber)
      .single()

    if (packageError) {
      console.error("Error fetching package:", packageError)
      return { success: false, error: packageError.message }
    }

    // Filter out the checkpoint to delete
    const checkpoints = (packageData.checkpoints || []).filter((checkpoint: any) => checkpoint.id !== checkpointId)

    // Update the package in the database
    const { error } = await supabase.from("packages").update({ checkpoints }).eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error deleting checkpoint:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the package page
    revalidatePath(`/admin/packages/${trackingNumber}`)
    revalidatePath("/admin/packages")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting checkpoint:", error)
    return { success: false, error: error.message }
  }
}

// Update checkpoints
export async function updateCheckpoints(trackingNumber: string, checkpoints: any[]) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    const supabase = createClient()

    // Update the package in the database
    const { error } = await supabase.from("packages").update({ checkpoints }).eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error updating checkpoints:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the package page
    revalidatePath(`/admin/packages/${trackingNumber}`)
    revalidatePath("/admin/packages")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating checkpoints:", error)
    return { success: false, error: error.message }
  }
}

// Update package location
export async function updatePackageLocation(trackingNumber: string, location: any) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("packages")
      .update({
        current_location: location,
      })
      .eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error updating package location:", error)
      return { success: false, error: error.message }
    }

    // Use revalidatePath only in app directory components
    try {
      revalidatePath(`/admin/packages/${trackingNumber}`)
      revalidatePath(`/track`)
    } catch (e) {
      // Silently catch errors if revalidatePath is not supported
      console.log("Note: revalidatePath not supported in this context")
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error updating package location:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
