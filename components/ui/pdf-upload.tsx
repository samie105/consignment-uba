"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PDFUploadProps {
  onFileAccepted: (file: File) => Promise<void>
  maxSize?: number
}

export function PDFUpload({ onFileAccepted, maxSize = 5 * 1024 * 1024 }: PDFUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const file = selectedFiles[0]
    
    // Check file size
    if (file.size > maxSize) {
      toast.error(`File is too large. Max size is ${Math.round(maxSize / (1024 * 1024))}MB`)
      return
    }
    
    // Check file type
    if (!file.type.includes('pdf')) {
      toast.error('Only PDF files are allowed')
      return
    }

    setUploading(true)

    try {
      await onFileAccepted(file)
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(`Failed to upload file: ${error.message}`)
    } finally {
      setUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-muted-foreground hover:bg-muted/50">
        <FileText className="h-10 w-10 mb-2" />
        <p className="text-sm font-medium">Click to upload PDF</p>
        <p className="text-xs">
          Max file size: {Math.round(maxSize / (1024 * 1024))}MB
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,application/pdf"
        className="hidden"
        disabled={uploading}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Select PDF
          </>
        )}
      </Button>
    </div>
  )
} 