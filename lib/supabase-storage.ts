"use server"

import { createClient } from "@/lib/supabase"

// Function to ensure the package-images bucket exists
export async function ensurePackageImagesBucket() {
  try {
    const supabase = createClient()

    // Try to get the bucket info directly
    const { data, error } = await supabase.storage.getBucket("package-images")

    if (error) {
      console.error("Error checking bucket:", error.message)

      // If the bucket doesn't exist, try to create it
      if (error.message.includes("does not exist")) {
        try {
          const { data, error: createError } = await supabase.storage.createBucket("package-images", {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          })

          if (createError) {
            console.error("Error creating bucket:", createError.message)
            return { success: false, error: createError.message }
          }

          console.log("Bucket created successfully:", data)
          return { success: true }
        } catch (createErr: any) {
          console.error("Error creating bucket:", createErr.message)
          return { success: false, error: createErr.message }
        }
      }

      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error checking bucket:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Function to upload a file to the package-images bucket
export async function uploadPackageImage(file: File, packageId: string) {
  try {
    // First ensure the bucket exists
    const bucketCheck = await ensurePackageImagesBucket()
    if (!bucketCheck.success) {
      return bucketCheck
    }

    const supabase = createClient()

    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${packageId}/${Date.now()}.${fileExt}`

    // Upload the file
    const { data, error } = await supabase.storage.from("package-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return { success: false, error: error.message }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from("package-images").getPublicUrl(fileName)

    return {
      success: true,
      url: urlData.publicUrl,
      path: fileName,
    }
  } catch (error: any) {
    console.error("Unexpected error uploading file:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Function to delete a file from the package-images bucket
export async function deletePackageImage(path: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage.from("package-images").remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error deleting file:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

export async function uploadFile(file: File): Promise<string> {
  try {
    const supabase = createClient()
    const packageId = "temp" // A temporary package ID
    const fileExt = file.name.split(".").pop()
    const fileName = `${packageId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("package-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      throw new Error(error.message)
    }

    const { data: urlData } = supabase.storage.from("package-images").getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (error: any) {
    console.error("Unexpected error uploading file:", error)
    throw new Error(error.message || "An unexpected error occurred")
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const supabase = createClient()
    const filePath = fileUrl.split("/").slice(6).join("/")

    const { error } = await supabase.storage.from("package-images").remove([filePath])

    if (error) {
      console.error("Error deleting file:", error)
      throw new Error(error.message)
    }
  } catch (error: any) {
    console.error("Unexpected error deleting file:", error)
    throw new Error(error.message || "An unexpected error occurred")
  }
}

export async function initStorage() {
  try {
    const supabase = createClient()

    // Check if the bucket exists
    const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket("package-images")

    if (getBucketError) {
      if (getBucketError.message.includes("does not exist")) {
        // Create the bucket if it doesn't exist
        const { data, error } = await supabase.storage.createBucket("package-images", {
          public: true,
        })

        if (error) {
          console.error("Error creating bucket:", error)
          throw new Error(error.message)
        }

        console.log("Bucket created successfully:", data)
      } else {
        console.error("Error checking bucket:", getBucketError)
        throw new Error(getBucketError.message)
      }
    } else {
      console.log("Bucket exists:", existingBucket)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error initializing storage:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
