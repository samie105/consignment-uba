import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Define the bucket name
const BUCKET_NAME = "package-images"

// Initialize the bucket - this now just checks if the bucket exists
export const initStorage = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error("Error listing buckets:", error)
      // Continue anyway - we'll handle missing bucket errors during upload
      return
    }

    // Log a message if the bucket doesn't exist
    if (!buckets?.find((bucket) => bucket.name === BUCKET_NAME)) {
      console.warn(`Bucket "${BUCKET_NAME}" does not exist. Please create it in the Supabase dashboard.`)
    }
  } catch (error) {
    console.error("Error checking storage bucket:", error)
    // Continue anyway - we'll handle errors during upload
  }
}

// Upload a file to Supabase Storage
export const uploadFile = async (file: File): Promise<string> => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload the file
    const { error: uploadError, data } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)

    if (uploadError) {
      if (uploadError.message.includes("bucket") && uploadError.message.includes("not found")) {
        throw new Error(`Bucket "${BUCKET_NAME}" not found. Please create it in the Supabase dashboard.`)
      }
      throw uploadError
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

// Delete a file from Supabase Storage
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const filePath = pathParts[pathParts.length - 1]

    // Delete the file
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}
