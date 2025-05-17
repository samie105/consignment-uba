"use client"

import { useState, useEffect } from "react"
import {
  encryptForEnv,
  decryptFromEnv,
  type ContentSection,
  saveContentSections,
  getContentSections,
} from "@/lib/content-protection"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Save, Plus, Trash, Edit, Eye, EyeOff, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminEncryptPage() {
  const [activeTab, setActiveTab] = useState("encrypt")
  const [content, setContent] = useState("")
  const [key, setKey] = useState("Greenroute Delivery")
  const [encrypted, setEncrypted] = useState("")
  const [decrypted, setDecrypted] = useState("")
  const [encryptedInput, setEncryptedInput] = useState("")
  const [sectionName, setSectionName] = useState("")
  const [envVarName, setEnvVarName] = useState("")
  const [sections, setSections] = useState<ContentSection[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)

  // Load saved sections on mount
  useEffect(() => {
    const savedSections = getContentSections()
    setSections(savedSections)
  }, [])

  const handleEncrypt = () => {
    if (!content) return
    const result = encryptForEnv(content, key)
    setEncrypted(result)
  }

  const handleDecrypt = () => {
    if (!encryptedInput) return
    try {
      const result = decryptFromEnv(encryptedInput, key)
      setDecrypted(result)
    } catch (error) {
      console.error("Error decrypting:", error)
      setDecrypted("Error: Could not decrypt content. Check your encryption key and try again.")
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddSection = () => {
    if (!sectionName || !encrypted || !envVarName) return

    const newSection: ContentSection = {
      id: Date.now().toString(),
      name: sectionName,
      content: encrypted,
      envVarName: envVarName.startsWith("NEXT_PUBLIC_") ? envVarName : `NEXT_PUBLIC_${envVarName}`,
    }

    const updatedSections = [...sections, newSection]
    setSections(updatedSections)
    saveContentSections(updatedSections)

    // Reset form
    setSectionName("")
    setEnvVarName("")
    setIsAddSectionOpen(false)
  }

  const handleDeleteSection = (id: string) => {
    const updatedSections = sections.filter((section) => section.id !== id)
    setSections(updatedSections)
    saveContentSections(updatedSections)
    if (selectedSection === id) {
      setSelectedSection(null)
      setEncryptedInput("")
      setDecrypted("")
    }
  }

  const handleLoadSection = (id: string) => {
    const section = sections.find((s) => s.id === id)
    if (section) {
      setSelectedSection(id)
      setEncryptedInput(section.content)
      setEnvVarName(section.envVarName)
      // Auto-decrypt
      try {
        const result = decryptFromEnv(section.content, key)
        setDecrypted(result)
      } catch (error) {
        console.error("Error decrypting:", error)
        setDecrypted("Error: Could not decrypt content. Check your encryption key and try again.")
      }
    }
  }

  const handleUpdateSection = () => {
    if (!selectedSection) return

    const updatedSections = sections.map((section) => {
      if (section.id === selectedSection) {
        return {
          ...section,
          content: encryptedInput,
          envVarName: envVarName.startsWith("NEXT_PUBLIC_") ? envVarName : `NEXT_PUBLIC_${envVarName}`,
        }
      }
      return section
    })

    setSections(updatedSections)
    saveContentSections(updatedSections)
  }

  return (
    <div className="container py-16 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Content Protection Admin</h1>

      <Tabs defaultValue="encrypt" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">Encrypt Content</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt & Manage</TabsTrigger>
        </TabsList>

        {/* Encrypt Tab */}
        <TabsContent value="encrypt">
          <Card>
            <CardHeader>
              <CardTitle>Encrypt Website Content</CardTitle>
              <CardDescription>Encrypt your website content to protect it from bots and scrapers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content to Encrypt</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the content you want to encrypt (can include HTML)"
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">Encryption Key</Label>
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter encryption key"
                />
                <p className="text-xs text-muted-foreground">
                  Remember this key as you'll need it to decrypt the content
                </p>
              </div>
              <Button onClick={handleEncrypt} className="w-full">
                Encrypt Content
              </Button>

              {encrypted && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="encrypted">Encrypted Content</Label>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(encrypted)}>
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <Textarea id="encrypted" value={encrypted} readOnly rows={4} />

                  <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Save as Section
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Content Section</DialogTitle>
                        <DialogDescription>
                          Save this encrypted content as a named section for easy management
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="sectionName">Section Name</Label>
                          <Input
                            id="sectionName"
                            value={sectionName}
                            onChange={(e) => setSectionName(e.target.value)}
                            placeholder="e.g., Hero Section, About Us, Services"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="envVarName">Environment Variable Name</Label>
                          <Input
                            id="envVarName"
                            value={envVarName}
                            onChange={(e) => setEnvVarName(e.target.value)}
                            placeholder="e.g., HERO_CONTENT, ABOUT_CONTENT"
                          />
                          <p className="text-xs text-muted-foreground">
                            NEXT_PUBLIC_ will be added automatically if not included
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddSection}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Section
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decrypt Tab */}
        <TabsContent value="decrypt">
          <Card>
            <CardHeader>
              <CardTitle>Decrypt & Manage Content</CardTitle>
              <CardDescription>Decrypt and manage your protected content sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Saved Sections */}
                <div className="md:col-span-1 space-y-4">
                  <h3 className="text-lg font-medium">Saved Sections</h3>
                  {sections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No saved sections yet</p>
                  ) : (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {sections.map((section) => (
                          <Card
                            key={section.id}
                            className={`cursor-pointer transition-colors ${selectedSection === section.id ? "border-primary" : ""}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                  <h4 className="font-medium">{section.name}</h4>
                                  <p className="text-xs text-muted-foreground truncate">{section.envVarName}</p>
                                </div>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleLoadSection(section.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section.id)}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Decrypt Form */}
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="encryptedInput">Encrypted Content</Label>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(encryptedInput)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      id="encryptedInput"
                      value={encryptedInput}
                      onChange={(e) => setEncryptedInput(e.target.value)}
                      placeholder="Paste encrypted content here or select a saved section"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="envVarNameDecrypt">Environment Variable Name</Label>
                    <Input
                      id="envVarNameDecrypt"
                      value={envVarName}
                      onChange={(e) => setEnvVarName(e.target.value)}
                      placeholder="e.g., NEXT_PUBLIC_HERO_CONTENT"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keyDecrypt">Decryption Key</Label>
                    <Input
                      id="keyDecrypt"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter decryption key"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleDecrypt} className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Decrypt
                    </Button>
                    {selectedSection && (
                      <Button onClick={handleUpdateSection} variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Update Section
                      </Button>
                    )}
                  </div>

                  {decrypted && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="decrypted">Decrypted Content</Label>
                        <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                          {showPreview ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide Preview
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Show Preview
                            </>
                          )}
                        </Button>
                      </div>

                      {showPreview ? (
                        <div
                          className="p-4 border rounded-md bg-muted/30 prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: decrypted }}
                        />
                      ) : (
                        <Textarea
                          id="decrypted"
                          value={decrypted}
                          onChange={(e) => setDecrypted(e.target.value)}
                          rows={8}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
              <p>Instructions:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Select a saved section or paste encrypted content</li>
                <li>Enter the decryption key</li>
                <li>Click "Decrypt" to view the content</li>
                <li>Make changes if needed and update the section</li>
                <li>Copy the environment variable name to use in your Vercel project</li>
              </ol>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Remember to add your encrypted content to your Vercel environment variables.</p>
        <p>
          Use the <code className="bg-muted px-1 py-0.5 rounded">ProtectedContent</code> component to display it in your
          website.
        </p>
      </div>
    </div>
  )
}
