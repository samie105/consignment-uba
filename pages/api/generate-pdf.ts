import { NextApiRequest, NextApiResponse } from "next"
import { generatePDF } from "@/lib/pdf-generator"
import { mkdir, stat } from "fs/promises"
import { join } from "path"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Ensure the pdfs directory exists
    const pdfDir = join(process.cwd(), "public", "pdfs")
    try {
      await mkdir(pdfDir, { recursive: true })
    } catch (error) {
      // Ignore if directory already exists
    }

    const { packageData } = req.body
    
    if (!packageData || !packageData.tracking_number) {
      return res.status(400).json({ error: "Invalid package data" })
    }

    console.log("Generating PDF for package:", packageData.tracking_number)
    const pdfUrl = await generatePDF(packageData)
    console.log("PDF generated successfully:", pdfUrl)
    
    // Check if the file was actually created
    const filePath = join(process.cwd(), "public", pdfUrl);
    try {
      const fileStats = await stat(filePath);
      if (!fileStats.isFile() || fileStats.size === 0) {
        throw new Error("PDF file is empty or not created properly");
      }
    } catch (error) {
      console.error("PDF file validation error:", error);
      return res.status(500).json({ error: "Failed to create PDF file. Please try again." });
    }
    
    res.status(200).json({ 
      success: true,
      url: pdfUrl,
      fileSize: (await stat(filePath)).size
    })
  } catch (error: any) {
    console.error("Error generating PDF:", error)
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate PDF: " + error.message 
    })
  }
} 