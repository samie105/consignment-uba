"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function getAllPackages() {
  try {
    const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return {
      success: true,
      packages: data,
      error: null,
    }
  } catch (error) {
    console.error("Error fetching packages:", error)
    return {
      success: false,
      packages: null,
      error: "Failed to fetch packages",
    }
  }
}

export async function getPackageById(trackingNumber: string) {
  try {
    // Get package
    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("*")
      .eq("tracking_number", trackingNumber)
      .single()

    if (packageError) throw packageError

    // Get checkpoints
    const { data: checkpoints, error: checkpointsError } = await supabase
      .from("checkpoints")
      .select("*")
      .eq("package_id", packageData.id)
      .order("timestamp", { ascending: true })

    if (checkpointsError) throw checkpointsError

    // Get images
    const { data: images, error: imagesError } = await supabase
      .from("package_images")
      .select("*")
      .eq("package_id", packageData.id)

    if (imagesError) throw imagesError

    return {
      success: true,
      package: {
        ...packageData,
        checkpoints,
        images: images.map((img) => img.url),
      },
      error: null,
    }
  } catch (error) {
    console.error("Error fetching package:", error)
    return {
      success: false,
      package: null,
      error: "Failed to fetch package",
    }
  }
}

export async function createPackage(packageData: any) {
  try {
    // Generate a tracking number if not provided
    if (!packageData.trackingNumber) {
      packageData.trackingNumber = generateTrackingNumber()
    }

    const packageId = uuidv4()

    // Prepare package data for insertion
    const newPackage = {
      id: packageId,
      tracking_number: packageData.trackingNumber,
      status: packageData.status,
      description: packageData.description,
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      sender: packageData.sender,
      recipient: packageData.recipient,
      payment: packageData.payment,
      current_location: null,
      created_at: new Date().toISOString(),
    }

    // Insert package
    const { error: packageError } = await supabase.from("packages").insert(newPackage)

    if (packageError) throw packageError

    // Insert checkpoints if any
    if (packageData.checkpoints && packageData.checkpoints.length > 0) {
      const checkpointsToInsert = packageData.checkpoints.map((checkpoint: any) => ({
        id: checkpoint.id || uuidv4(),
        package_id: packageId,
        location: checkpoint.location,
        description: checkpoint.description,
        timestamp: checkpoint.timestamp,
        status: checkpoint.status,
        coordinates: checkpoint.coordinates || null,
      }))

      const { error: checkpointsError } = await supabase.from("checkpoints").insert(checkpointsToInsert)

      if (checkpointsError) throw checkpointsError
    }

    // Insert images if any
    if (packageData.images && packageData.images.length > 0) {
      const imagesToInsert = packageData.images.map((url: string) => ({
        id: uuidv4(),
        package_id: packageId,
        url,
        created_at: new Date().toISOString(),
      }))

      const { error: imagesError } = await supabase.from("package_images").insert(imagesToInsert)

      if (imagesError) throw imagesError
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/packages")

    return {
      success: true,
      trackingNumber: packageData.trackingNumber,
    }
  } catch (error) {
    console.error("Error creating package:", error)
    return {
      success: false,
      error: "Failed to create package",
    }
  }
}

export async function updatePackage(trackingNumber: string, packageData: any) {
  try {
    // Get package ID
    const { data: existingPackage, error: fetchError } = await supabase
      .from("packages")
      .select("id")
      .eq("tracking_number", trackingNumber)
      .single()

    if (fetchError) throw fetchError

    // Update package
    const { error: updateError } = await supabase
      .from("packages")
      .update({
        status: packageData.status,
        description: packageData.description,
        weight: packageData.weight,
        dimensions: packageData.dimensions,
        sender: packageData.sender,
        recipient: packageData.recipient,
        payment: packageData.payment,
        current_location: packageData.current_location || null,
      })
      .eq("id", existingPackage.id)

    if (updateError) throw updateError

    // Update images if provided
    if (packageData.images) {
      // Delete existing images
      const { error: deleteImagesError } = await supabase
        .from("package_images")
        .delete()
        .eq("package_id", existingPackage.id)

      if (deleteImagesError) throw deleteImagesError

      // Insert new images
      if (packageData.images.length > 0) {
        const imagesToInsert = packageData.images.map((url: string) => ({
          id: uuidv4(),
          package_id: existingPackage.id,
          url,
          created_at: new Date().toISOString(),
        }))

        const { error: insertImagesError } = await supabase.from("package_images").insert(imagesToInsert)

        if (insertImagesError) throw insertImagesError
      }
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/packages")
    revalidatePath(`/admin/packages/${trackingNumber}`)

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("Error updating package:", error)
    return {
      success: false,
      error: "Failed to update package",
    }
  }
}

export async function deletePackage(trackingNumber: string) {
  try {
    // Get package ID
    const { data: packageData, error: fetchError } = await supabase
      .from("packages")
      .select("id")
      .eq("tracking_number", trackingNumber)
      .single()

    if (fetchError) throw fetchError

    // Delete checkpoints
    const { error: checkpointsError } = await supabase.from("checkpoints").delete().eq("package_id", packageData.id)

    if (checkpointsError) throw checkpointsError

    // Delete images
    const { error: imagesError } = await supabase.from("package_images").delete().eq("package_id", packageData.id)

    if (imagesError) throw imagesError

    // Delete package
    const { error: packageError } = await supabase.from("packages").delete().eq("id", packageData.id)

    if (packageError) throw packageError

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/packages")

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("Error deleting package:", error)
    return {
      success: false,
      error: "Failed to delete package",
    }
  }
}

export async function addCheckpoint(trackingNumber: string, checkpoint: any) {
  try {
    // Get package ID
    const { data: packageData, error: fetchError } = await supabase
      .from("packages")
      .select("id")
      .eq("tracking_number", trackingNumber)
      .single()

    if (fetchError) throw fetchError

    // Add checkpoint
    const newCheckpoint = {
      id: checkpoint.id || uuidv4(),
      package_id: packageData.id,
      location: checkpoint.location,
      description: checkpoint.description,
      timestamp: checkpoint.timestamp || new Date().toISOString(),
      status: checkpoint.status,
      coordinates: checkpoint.coordinates || null,
    }

    const { error: checkpointError } = await supabase.from("checkpoints").insert(newCheckpoint)

    if (checkpointError) throw checkpointError

    // Update package current location if coordinates are provided
    if (checkpoint.coordinates) {
      const { error: updateError } = await supabase
        .from("packages")
        .update({
          current_location: {
            lat: checkpoint.coordinates.lat,
            lng: checkpoint.coordinates.lng,
            address: checkpoint.location,
          },
          status: checkpoint.status,
        })
        .eq("id", packageData.id)

      if (updateError) throw updateError
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/packages")
    revalidatePath(`/admin/packages/${trackingNumber}`)

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("Error adding checkpoint:", error)
    return {
      success: false,
      error: "Failed to add checkpoint",
    }
  }
}

export async function deleteCheckpoint(trackingNumber: string, checkpointId: string) {
  try {
    // Delete checkpoint
    const { error } = await supabase.from("checkpoints").delete().eq("id", checkpointId)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/packages")
    revalidatePath(`/admin/packages/${trackingNumber}`)

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("Error deleting checkpoint:", error)
    return {
      success: false,
      error: "Failed to delete checkpoint",
    }
  }
}

export async function updatePackageLocation(trackingNumber: string, location: any) {
  try {
    // Update package location
    const { error } = await supabase
      .from("packages")
      .update({
        current_location: location,
      })
      .eq("tracking_number", trackingNumber)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/packages")
    revalidatePath(`/admin/packages/${trackingNumber}`)

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("Error updating package location:", error)
    return {
      success: false,
      error: "Failed to update package location",
    }
  }
}

function generateTrackingNumber() {
  return `DU${Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0")}`
}
