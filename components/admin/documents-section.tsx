import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { Download, Upload, FileText, Trash2 } from "lucide-react"
import { PDFUpload } from "@/components/ui/pdf-upload"
import { Badge } from "@/components/ui/badge"

interface DocumentsSectionProps {
  packageData: any
  onPDFUploaded: (url: string) => void
}

export function DocumentsSection({ packageData, onPDFUploaded }: DocumentsSectionProps) {
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedPDF, setUploadedPDF] = useState<string | null>(null)

  const handlePDFUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload PDF")

      const data = await response.json()
      setUploadedPDF(data.url)
      onPDFUploaded(data.url)
      toast.success("PDF uploaded successfully")
    } catch (error) {
      console.error("Error uploading PDF:", error)
      toast.error("Failed to upload PDF")
    }
  }

  const handleGeneratePDF = async () => {
    if (!packageData) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageData }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const data = await response.json()
      onPDFUploaded(data.url)
      
      const filename = data.url.split('/').pop();
      window.location.href = `/api/download-pdf?filename=${filename}`;
      
      toast.success("PDF generated and download started")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
        <CardDescription>Manage package documents and PDFs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Auto-generate PDF</label>
              <p className="text-sm text-muted-foreground">
                Automatically generate a professional PDF when exporting
              </p>
            </div>
            <Switch
              checked={autoGenerate}
              onCheckedChange={setAutoGenerate}
            />
          </div>

          {!autoGenerate && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload PDF</label>
                <p className="text-sm text-muted-foreground">
                  Upload a custom PDF document (will replace existing PDF)
                </p>
                <PDFUpload 
                  onFileAccepted={handlePDFUpload}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </div>
            </div>
          )}

          {packageData.pdfs && packageData.pdfs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Existing PDFs</label>
                <Badge variant="outline">{packageData.pdfs.length} files</Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {packageData.pdfs.map((pdf: string, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {pdf.split("/").pop()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const filename = pdf.split('/').pop();
                          window.location.href = `/api/download-pdf?filename=${filename}`;
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          const newPdfs = packageData.pdfs.filter((_: string, i: number) => i !== index);
                          onPDFUploaded(newPdfs);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating || (!autoGenerate && !uploadedPDF)}
              className="min-w-[120px]"
            >
              {isGenerating ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 