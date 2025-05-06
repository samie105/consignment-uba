import { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import { join } from "path"
import { createWriteStream, mkdir } from "fs"
import { promisify } from "util"

const mkdirAsync = promisify(mkdir)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Ensure the directory exists
    const uploadDir = join(process.cwd(), "public", "pdfs")
    try {
      await mkdirAsync(uploadDir, { recursive: true })
    } catch (error) {
      // Ignore if directory already exists
    }

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err)
          res.status(500).json({ error: "Failed to upload file" })
          return resolve(true)
        }

        const file = files.pdf && Array.isArray(files.pdf) ? files.pdf[0] : files.pdf
        if (!file) {
          res.status(400).json({ error: "No file provided" })
          return resolve(true)
        }

        // Only accept PDF files
        if (file.mimetype !== "application/pdf") {
          res.status(400).json({ error: "Only PDF files are allowed" })
          return resolve(true)
        }

        try {
          // Generate a unique filename
          const filename = `uploaded-${Date.now()}-${file.originalFilename}`
          const filepath = join(uploadDir, filename)

          // Create a read stream from the temporary file
          const oldPath = file.filepath
          const writeStream = createWriteStream(filepath)

          // Copy the file to the new location
          const reader = require("fs").createReadStream(oldPath)
          reader.pipe(writeStream)

          writeStream.on("finish", () => {
            // Delete the temporary file
            require("fs").unlinkSync(oldPath)

            // Return the URL of the uploaded file
            const url = `/pdfs/${filename}`
            res.status(200).json({ url })
            resolve(true)
          })

          writeStream.on("error", (error: any) => {
            console.error("Error writing file:", error)
            res.status(500).json({ error: "Failed to save file" })
            resolve(true)
          })
        } catch (error) {
          console.error("Error saving file:", error)
          res.status(500).json({ error: "Failed to save file" })
          resolve(true)
        }
      })
    })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    res.status(500).json({ error: "Failed to upload PDF" })
  }
} 