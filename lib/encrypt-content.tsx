"use client"

import { useState } from "react"
import { encryptForEnv } from "./content-protection"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"

export default function ContentEncryptor() {
  const [content, setContent] = useState("")
  const [key, setKey] = useState("Greenroute Delivery")
  const [encrypted, setEncrypted] = useState("")
  const [copied, setCopied] = useState(false)

  const handleEncrypt = () => {
    if (!content) return
    const result = encryptForEnv(content, key)
    setEncrypted(result)
  }

  const handleCopy = () => {
    if (!encrypted) return
    navigator.clipboard.writeText(encrypted)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Content Encryptor</CardTitle>
        <CardDescription>Encrypt your website content to store in environment variables</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content to Encrypt</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the content you want to encrypt"
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Encryption Key</label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter encryption key" />
          <p className="text-xs text-muted-foreground">Remember this key as you'll need it to decrypt the content</p>
        </div>
        <Button onClick={handleEncrypt} className="w-full">
          Encrypt Content
        </Button>
        {encrypted && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Encrypted Content</label>
            <div className="relative">
              <Textarea value={encrypted} readOnly rows={4} className="pr-10" />
              <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-green-500">Copied to clipboard!</p>}
            <p className="text-xs text-muted-foreground">
              Add this to your environment variables with a descriptive name like NEXT_PUBLIC_HERO_CONTENT
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
        <p>Instructions:</p>
        <ol className="list-decimal pl-5 space-y-1 mt-2">
          <li>Enter your content (can include HTML)</li>
          <li>Set an encryption key (remember this!)</li>
          <li>Click "Encrypt Content"</li>
          <li>Copy the encrypted string to your environment variables</li>
          <li>Use the ProtectedContent component to display it</li>
        </ol>
      </CardFooter>
    </Card>
  )
}
