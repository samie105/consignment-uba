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
import { updatePackage } from "@/server/actions/packageActions"
import { CheckpointEditor } from "./checkpoint-editor"
import { FileUpload } from "@/components/ui/file-upload"

// Add the missing imports at the top of the file
import { Package, User, UserCheck, Clock, ImageIcon } from "lucide-react"

// Define the form schema
const formSchema = z.object({
  status: z.string(),
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
    isPaid: z.boolean(),
    method: z.string().optional(),
  }),
  images: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditPackageFormProps {
  packageData: any
}

export function EditPackageForm({ packageData }: EditPackageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(packageData.images || [])

  // Initialize form with package data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: packageData.status,
      description: packageData.description,
      weight: packageData.weight,
      dimensions: {
        length: packageData.dimensions.length,
        width: packageData.dimensions.width,
        height: packageData.dimensions.height,
      },
      sender: {
        fullName: packageData.sender.fullName,
        email: packageData.sender.email,
        phone: packageData.sender.phone,
        address: packageData.sender.address,
      },
      recipient: {
        fullName: packageData.recipient.fullName,
        email: packageData.recipient.email,
        phone: packageData.recipient.phone,
        address: packageData.recipient.address,
      },
      payment: {
        amount: packageData.payment.amount,
        isPaid: packageData.payment.isPaid,
        method: packageData.payment.method || "none",
      },
      images: packageData.images || [],
    },
  })

  const handleImagesUpload = (files: string[]) => {
    setImages(files)
    form.setValue("images", files)
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      const result = await updatePackage(packageData.tracking_number, {
        ...values,
        images,
      })

      if (result.success) {
        toast.success("Package updated", {
          description: "The package has been updated successfully.",
        })
        router.push(`/admin/packages/${packageData.tracking_number}`)
        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "Failed to update package. Please try again.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      })
      console.error("Update error:", error)
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
        <TabsTrigger value="images" className="flex items-center justify-center">
          <ImageIcon className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden sm:inline">Images</span>
        </TabsTrigger>
        <TabsTrigger value="tracking" className="flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2 md:mr-2" />
          <span className="hidden sm:inline">Tracking</span>
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

          <TabsContent value="images" className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Package Images</h3>
              <p className="text-sm text-muted-foreground">
                Upload images of the package for documentation and verification purposes.
              </p>

              <FileUpload onUpload={handleImagesUpload} initialFiles={images} maxFiles={5} />
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4 pt-4">
            <CheckpointEditor
              tracking_number={packageData.tracking_number}
              initialCheckpoints={packageData.checkpoints || []}
              onCheckpointAdded={() => {
                toast.success("Checkpoint added successfully")
              }}
            />
          </TabsContent>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  )
}
