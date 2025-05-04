"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function ExportPDFButton({ packageData }: { packageData: any }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // In a real application, you would use a library like jsPDF or call an API
      // to generate a PDF. This is a simulation.
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a fake download
      const element = document.createElement("a")
      element.setAttribute("href", "data:application/pdf;charset=utf-8,")
      element.setAttribute("download", `tracking_${packageData.tracking_number}.pdf`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "PDF Generated",
        description: "Your tracking information has been exported as PDF.",
      })
    } catch (error) {
      toast({
        title: "Failed to generate PDF",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={generatePDF}
      disabled={isGenerating}
    >
      <FileDown className="h-4 w-4" />
      <span>{isGenerating ? "Generating..." : "Export PDF"}</span>
    </Button>
  )
}
