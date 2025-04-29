"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { uploadFile, deleteFile } from "@/lib/supabase-storage"

interface FileUploadProps {
  onUpload: (files: string[]) => void
  initialFiles?: string[]
  maxFiles?: number
  accept?: string
}

// Add a helper function to validate image URLs
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false
  return typeof url === "string" && url.trim().length > 0
}

export function FileUpload({ onUpload, initialFiles = [], maxFiles = 5, accept = "image/*" }: FileUploadProps) {
  // Filter out any empty strings from initialFiles
  const filteredInitialFiles = initialFiles.filter((file) => file && file.trim() !== "")
  const [files, setFiles] = useState<string[]>(filteredInitialFiles)
  const [uploading, setUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        try {
          const url = await uploadFile(file)
          toast.success(`Uploaded ${file.name}`)
          return url
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`)
          console.error("Upload error:", error)
          return null
        }
      })

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[]
      const updatedFiles = [...files, ...uploadedUrls]

      setFiles(updatedFiles)
      onUpload(updatedFiles)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("An error occurred during upload")
    } finally {
      setUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeFile = async (index: number) => {
    try {
      const fileUrl = files[index]

      // Remove from Supabase Storage
      if (fileUrl && !fileUrl.includes("placeholder.svg")) {
        await deleteFile(fileUrl)
      }

      // Update state
      const updatedFiles = [...files]
      updatedFiles.splice(index, 1)
      setFiles(updatedFiles)
      onUpload(updatedFiles)

      toast.success("File removed")
    } catch (error) {
      console.error("Remove file error:", error)
      toast.error("Failed to remove file")
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {files.map((file, index) => (
          <div key={index} className="relative aspect-square rounded-md border bg-muted">
            {isValidImageUrl(file) ? (
              <Image
                src={file || "/placeholder.svg"}
                alt={`Uploaded file ${index + 1}`}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        ))}

        {files.length < maxFiles && !uploading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50"
          >
            <Upload className="h-6 w-6" />
            <span className="sr-only">Upload file</span>
          </button>
        )}

        {uploading && (
          <div className="flex aspect-square items-center justify-center rounded-md border border-dashed text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="sr-only">Uploading...</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        multiple={files.length < maxFiles}
        disabled={uploading}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={files.length >= maxFiles || uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload {files.length > 0 ? "More" : ""} Images
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        {files.length} of {maxFiles} files uploaded. Supported formats: JPG, PNG, GIF
      </p>
    </div>
  )
}
