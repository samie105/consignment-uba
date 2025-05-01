"\"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

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

// Create a new package
export async function createPackage(packageData: any) {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    // Generate a tracking number
    const trackingNumber = generateTrackingNumber()

    // Prepare the package data
    const newPackage = {
      tracking_number: trackingNumber,
      status: packageData.status,
      description: packageData.description,
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      sender: packageData.sender,
      recipient: packageData.recipient,
      payment: packageData.payment,
      images: packageData.images || [],
      checkpoints: packageData.checkpoints || [],
      created_at: new Date().toISOString(),
    }

    // Insert the package into the database
    const { data, error } = await supabase.from("packages").insert([newPackage]).select()

    if (error) {
      console.error("Error creating package:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the packages page
    revalidatePath("/admin/packages")

    return { success: true, trackingNumber }
  } catch (error: any) {
    console.error("Error creating package:", error)
    return { success: false, error: error.message }
  }
}

// Generate a tracking number
function generateTrackingNumber() {
  // Generate a random string of 12 characters
  const randomPart = uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase()

  // Add a prefix
  return `DU${randomPart}`
}

// Get all packages
export async function getAllPackages() {
  try {
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return { success: false, error: configCheck.error }
    }

    const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching packages:", error)
      return { success: false, error: error.message }
    }

    return { success: true, packages: data, error: null }
  } catch (error: any) {
    console.error("Error fetching packages:", error)
    return { success: false, error: error.message, packages: null }
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
    // Check if Supabase is configured
    const configCheck = checkSupabaseConfig()
    if (!configCheck.success) {
      return configCheck
    }

    // Update the package in the database
    const { error } = await supabase
      .from("packages")
      .update({ current_location: location })
      .eq("tracking_number", trackingNumber)

    if (error) {
      console.error("Error updating package location:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the package page
    revalidatePath(`/admin/packages/${trackingNumber}`)
    revalidatePath("/admin/packages")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating package location:", error)
    return { success: false, error: error.message }
  }
}
