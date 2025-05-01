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
      if (error.message.includes("credentials")) {
        console.error(
          "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
        )
        return { success: false, error: "Supabase credentials are missing" }
      }

      console.error("Error listing buckets:", error)
      return { success: false, error: error.message }
    }

    // Log a message if the bucket doesn't exist
    if (!buckets?.find((bucket) => bucket.name === BUCKET_NAME)) {
      console.warn(`Bucket "${BUCKET_NAME}" does not exist. Please create it in the Supabase dashboard.`)
      return {
        success: false,
        error: `Bucket "${BUCKET_NAME}" does not exist. Please create it in the Supabase dashboard.`,
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error checking storage bucket:", error)
    return { success: false, error: error.message || "Unknown error" }
  }
}

// Upload a file to Supabase Storage
export const uploadFile = async (file: File): Promise<string> => {
  try {
    // Check if Supabase is properly configured
    const storageStatus = await initStorage()
    if (!storageStatus.success) {
      throw new Error(storageStatus.error || "Storage not initialized")
    }

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
  } catch (error: any) {
    console.error("Error uploading file:", error)

    // Provide a more user-friendly error message
    if (error.message.includes("credentials")) {
      throw new Error("Supabase credentials are missing. Please check your environment variables.")
    } else if (error.message.includes("bucket")) {
      throw new Error(`The storage bucket "${BUCKET_NAME}" doesn't exist. Please create it in your Supabase dashboard.`)
    }

    throw error
  }
}

// Delete a file from Supabase Storage
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Check if Supabase is properly configured
    const storageStatus = await initStorage()
    if (!storageStatus.success) {
      throw new Error(storageStatus.error || "Storage not initialized")
    }

    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const filePath = pathParts[pathParts.length - 1]

    // Delete the file
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      throw error
    }
  } catch (error: any) {
    console.error("Error deleting file:", error)

    // Provide a more user-friendly error message
    if (error.message.includes("credentials")) {
      throw new Error("Supabase credentials are missing. Please check your environment variables.")
    } else if (error.message.includes("bucket")) {
      throw new Error(`The storage bucket "${BUCKET_NAME}" doesn't exist. Please create it in your Supabase dashboard.`)
    }

    throw error
  }
}
