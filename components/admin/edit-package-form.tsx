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
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { updatePackage } from "@/server/actions/packageActions"
import { CheckpointEditor } from "./checkpoint-editor"
import { FileUpload } from "@/components/ui/file-upload"
import type { Package } from "@/types/package"
import { Package as LucidePackage, User, UserCheck, Clock, ImageIcon, FileText, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PDFUpload } from "@/components/ui/pdf-upload"
import { DocumentsSection } from "./documents-section"

// Define the form schema
const formSchema = z.object({
  status: z.string().optional(),
  description: z.string().optional(),
  weight: z.coerce.number().optional(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional(),
  sender: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  recipient: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  payment: z.object({
    amount: z.coerce.number().optional(),
    isPaid: z.boolean().optional(),
    method: z.string().optional(),
    isVisible: z.boolean().optional(),
  }).optional(),
  images: z.array(z.string()).optional(),
  pdfs: z.array(z.string()).optional(),
  checkpoints: z.array(z.object({
    id: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    timestamp: z.string().optional(),
    status: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
    customTime: z.boolean().optional(),
    customDate: z.boolean().optional(),
  })).optional(),
  package_type: z.enum(['standard', 'express', 'priority', 'custom']).optional(),
  date_shipped: z.string().optional(),
  estimated_delivery_date: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditPackageFormProps {
  packageData: Package
  onSuccess?: () => void
}

export function EditPackageForm({ packageData, onSuccess = () => {} }: EditPackageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(packageData.images || [])
  const [pdfs, setPdfs] = useState<string[]>(packageData.pdfs || [])
  const [showDocuments, setShowDocuments] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: packageData.status,
      description: packageData.description,
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      sender: packageData.sender,
      recipient: packageData.recipient,
      payment: {
        ...packageData.payment,
        isVisible: packageData.payment.isVisible ?? true,
      },
      images: packageData.images || [],
      pdfs: packageData.pdfs || [],
      checkpoints: (packageData.checkpoints || []).map(checkpoint => ({
        ...checkpoint,
        customTime: false,
        customDate: false,
      })),
      package_type: packageData.package_type || 'standard',
      date_shipped: packageData.date_shipped || '',
      estimated_delivery_date: packageData.estimated_delivery_date || '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    console.log("submitting")
    setIsSubmitting(true)
    try {
      console.log("Saving package with values:", {
        ...values,
        images,
        pdfs,
        tracking_number: packageData.tracking_number 
      })
      
      // Create a copy of the values so we don't modify the form values directly
      const dataToSave = {
        ...values,
        images,
        pdfs,
        tracking_number: packageData.tracking_number
      }
      
      const updateResult = await updatePackage(packageData.tracking_number, dataToSave)
      
      console.log("Update result:", updateResult)
      
      if (updateResult.success) {
        toast.success("Package updated successfully")
        onSuccess()
      } else {
        toast.error("Failed to update package", {
          description: updateResult.error,
        })
      }
    } catch (error) {
      console.error("Error updating package:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details" className="flex items-center justify-center">
            <LucidePackage className="h-4 w-4 mr-2 md:mr-2" />
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
          <form className="space-y-6">
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
                  name="payment.isVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Payment Visibility</FormLabel>
                        <FormDescription>
                          Show or hide payment information in customer view
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="package_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select package type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_shipped"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Shipped</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_delivery_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <FileUpload
                onUpload={(files) => {
                  setImages(files)
                  form.setValue("images", files)
                }}
                initialFiles={images}
                maxFiles={5}
              />
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4 pt-4">
              <CheckpointEditor
                tracking_number={packageData.tracking_number}
                initialCheckpoints={packageData.checkpoints?.map(checkpoint => ({
                  ...checkpoint,
                  coordinates: checkpoint.coordinates ? {
                    lat: checkpoint.coordinates.latitude,
                    lng: checkpoint.coordinates.longitude
                  } : null,
                  customTime: false,
                  customDate: false,
                }))}
                onCheckpointAdded={() => {
                  form.setValue("checkpoints", packageData.checkpoints || [])
                }}
                allowCustomTime={true}
              />
            </TabsContent>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/packages')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </>
  )
}
