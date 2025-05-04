"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { createPackage } from "@/server/actions/packageActions"
import { Package, User, UserCheck, ImageIcon, Clock, Plus, Trash, Upload } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Card, CardContent } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"

// Define the checkpoint type
interface Checkpoint {
  id: string
  location: string
  description: string
  timestamp: string
  status: string
}

// Define the form schema
const formSchema = z.object({
  status: z.string().default("pending"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  weight: z.coerce.number().positive("Weight must be a positive number"),
  dimensions: z.object({
    length: z.coerce.number().positive("Length must be a positive number"),
    width: z.coerce.number().positive("Width must be a positive number"),
    height: z.coerce.number().positive("Height must be a positive number"),
  }),
  sender: z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number must be at least 5 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
  }),
  recipient: z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number must be at least 5 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
  }),
  payment: z.object({
    amount: z.coerce.number().positive("Amount must be a positive number"),
    isPaid: z.boolean().default(false),
    method: z.string().optional(),
  }),
  images: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreatePackageForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [newCheckpoint, setNewCheckpoint] = useState({
    location: "",
    description: "",
    status: "pending",
  })
  const [images, setImages] = useState<string[]>([])
  const [checkpointErrors, setCheckpointErrors] = useState({
    location: false,
    description: false,
  })

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
      description: "",
      weight: 1,
      dimensions: {
        length: 10,
        width: 10,
        height: 10,
      },
      sender: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
      },
      recipient: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
      },
      payment: {
        amount: 0,
        isPaid: false,
        method: "none",
      },
      images: [],
    },
  })

  // Add a helper function to validate image URLs
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false
    return typeof url === "string" && url.trim().length > 0
  }

  // Update the handleImagesUpload function
  const handleImagesUpload = (files: string[]) => {
    const validFiles = files.filter(isValidImageUrl)
    setImages(validFiles)
    form.setValue("images", validFiles)
  }

  // Function to add a new checkpoint
  const addCheckpoint = () => {
    // Validate checkpoint fields
    const locationError = !newCheckpoint.location.trim()
    const descriptionError = !newCheckpoint.description.trim()

    setCheckpointErrors({
      location: locationError,
      description: descriptionError,
    })

    if (locationError || descriptionError) {
      return
    }

    const checkpoint: Checkpoint = {
      id: uuidv4(),
      location: newCheckpoint.location,
      description: newCheckpoint.description,
      timestamp: new Date().toISOString(),
      status: newCheckpoint.status,
    }

    setCheckpoints([...checkpoints, checkpoint])
    setNewCheckpoint({
      location: "",
      description: "",
      status: "pending",
    })

    toast.success("Checkpoint added", {
      description: "The checkpoint has been added to the package.",
    })
  }

  // Function to delete a checkpoint
  const deleteCheckpoint = (id: string) => {
    setCheckpoints(checkpoints.filter((checkpoint) => checkpoint.id !== id))
    toast.success("Checkpoint removed")
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      // Include checkpoints with the package data
      const packageData = {
        ...data,
        images,
        checkpoints,
      }

      const result = await createPackage(packageData)

      if (result.success) {
        toast.success("Package created", {
          description: `Package created successfully with tracking number: ${result.tracking_number}`,
        })
        router.push(`/admin/packages/${result.tracking_number}`)
        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "Failed to create package. Please try again.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      })
      console.error("Package creation error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="details" className="flex items-center justify-center">
          <Package className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden sm:inline">Package Details</span>
        </TabsTrigger>
        <TabsTrigger value="sender" className="flex items-center justify-center">
          <User className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden sm:inline">Sender</span>
        </TabsTrigger>
        <TabsTrigger value="recipient" className="flex items-center justify-center">
          <UserCheck className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden sm:inline">Recipient</span>
        </TabsTrigger>
        <TabsTrigger value="tracking" className="flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden sm:inline">Tracking</span>
        </TabsTrigger>
        <TabsTrigger value="images" className="flex items-center justify-center">
          <ImageIcon className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden sm:inline">Images</span>
        </TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="details" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_warehouse">In Warehouse</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="arrived">Arrived</SelectItem>
                      <SelectItem value="customs_check">Customs Check</SelectItem>
                      <SelectItem value="customs_hold">Customs Clearance (ON HOLD)</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Package description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions.length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions.width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions.height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Information</h3>

              <FormField
                control={form.control}
                name="payment.amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment.isPaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Payment Received</FormLabel>
                        <FormDescription>Mark if payment has been received</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment.method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="PayPal">PayPal</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sender" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="sender.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sender.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sender.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sender.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="recipient" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="recipient.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recipient.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipient.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recipient.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4 pt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tracking History</h3>
                <p className="text-sm text-muted-foreground">
                  Add checkpoints to track the package's journey. You can add more checkpoints later.
                </p>

                {checkpoints.length > 0 ? (
                  <div className="space-y-4">
                    {checkpoints.map((checkpoint, index) => (
                      <Card key={checkpoint.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-medium">{checkpoint.location}</p>
                              <p className="text-sm text-muted-foreground">{checkpoint.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(checkpoint.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => deleteCheckpoint(checkpoint.id)}
                              title="Delete checkpoint"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-lg bg-muted/20">
                    <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-1">No Checkpoints Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Tracking information will be updated once the shipment begins.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Add New Checkpoint</h3>
                <p className="text-sm text-muted-foreground">
                  Add a new checkpoint to track the package's journey. This is optional and can be added later.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkpoint-location" className="block text-sm font-medium">
                      Location
                    </label>
                    <Input
                      id="checkpoint-location"
                      placeholder="e.g., Sorting Facility, New York"
                      value={newCheckpoint.location}
                      onChange={(e) => {
                        setNewCheckpoint({ ...newCheckpoint, location: e.target.value })
                        if (e.target.value.trim()) {
                          setCheckpointErrors({ ...checkpointErrors, location: false })
                        }
                      }}
                      className={checkpointErrors.location ? "border-destructive" : ""}
                    />
                    {checkpointErrors.location && <p className="text-sm text-destructive mt-1">Location is required</p>}
                  </div>

                  <div>
                    <label htmlFor="checkpoint-status" className="block text-sm font-medium">
                      Status
                    </label>
                    <select
                      id="checkpoint-status"
                      value={newCheckpoint.status}
                      onChange={(e) => setNewCheckpoint({ ...newCheckpoint, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_warehouse">In Warehouse</option>
                      <option value="in_transit">In Transit</option>
                      <option value="arrived">Arrived</option>
                      <option value="customs_check">Customs Check</option>
                      <option value="customs_hold">Customs Clearance (ON HOLD)</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="checkpoint-description" className="block text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="checkpoint-description"
                    placeholder="e.g., Package received at sorting facility"
                    value={newCheckpoint.description}
                    onChange={(e) => {
                      setNewCheckpoint({ ...newCheckpoint, description: e.target.value })
                      if (e.target.value.trim()) {
                        setCheckpointErrors({ ...checkpointErrors, description: false })
                      }
                    }}
                    className={checkpointErrors.description ? "border-destructive" : ""}
                  />
                  {checkpointErrors.description && (
                    <p className="text-sm text-destructive mt-1">Description is required</p>
                  )}
                </div>

                <Button onClick={addCheckpoint} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Checkpoint
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Package Images</h3>
              <p className="text-sm text-muted-foreground">
                Upload images of the package for documentation and verification purposes. This is optional and can be
                added later.
              </p>

              {images.length > 0 ? (
                <FileUpload onUpload={handleImagesUpload} initialFiles={images} maxFiles={5} />
              ) : (
                <div className="text-center p-6 border rounded-lg bg-muted/20 mb-4">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-1">No Images Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Package images will be updated as the shipment progresses.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("upload-images-button")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                </div>
              )}

              {images.length === 0 && <FileUpload onUpload={handleImagesUpload} initialFiles={images} maxFiles={5} />}
            </div>
          </TabsContent>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Package"}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  )
}
