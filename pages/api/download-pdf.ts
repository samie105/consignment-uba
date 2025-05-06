import { NextApiRequest, NextApiResponse } from "next"
import { readFile } from "fs/promises"
import { join } from "path"
import path from "path"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { filename } = req.query
    
    if (!filename || typeof filename !== "string") {
      return res.status(400).json({ error: "Filename is required" })
    }
    
    // Sanitize filename to prevent directory traversal attacks
    const sanitizedFilename = path.basename(filename)
    
    // Construct the file path
    const filePath = join(process.cwd(), "public", "pdfs", sanitizedFilename)
    
    try {
      const fileBuffer = await readFile(filePath)
      
      // Set headers for file download
      res.setHeader("Content-Disposition", `attachment; filename="${sanitizedFilename}"`)
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Length", fileBuffer.length)
      
      // Send the file
      res.status(200).send(fileBuffer)
    } catch (error) {
      console.error("Error reading PDF file:", error)
      res.status(404).json({ error: "PDF file not found" })
    }
  } catch (error) {
    console.error("Error in download-pdf API:", error)
    res.status(500).json({ error: "Failed to download PDF" })
  }
} 