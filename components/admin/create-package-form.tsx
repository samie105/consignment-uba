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
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { createPackage, generatetracking_number } from "@/server/actions/packageActions"
import { CheckpointEditor } from "./checkpoint-editor"
import { FileUpload } from "@/components/ui/file-upload"
import { Package as LucidePackage, User, UserCheck, Clock, ImageIcon, FileText, Plus, Trash, Upload, LucideRefreshCw, CalendarIcon } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Badge } from "@/components/ui/badge"
import { isValidImageUrl } from "@/lib/utils"
import type { Checkpoint } from "@/lib/supabase"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Define the form schema
const formSchema = z.object({
  tracking_number: z.string().min(1, "Tracking number is required"),
  status: z.string().optional().default("pending"),
  description: z.string().optional().default(""),
  weight: z.coerce.number().optional().default(0),
  dimensions: z.object({
    length: z.coerce.number().optional().default(0),
    width: z.coerce.number().optional().default(0),
    height: z.coerce.number().optional().default(0),
  }).optional().default({length: 0, width: 0, height: 0}),
  sender: z.object({
    fullName: z.string().optional().default(""),
    email: z.string().email("Invalid email format").optional().default(""),
    phone: z.string().optional().default(""),
    address: z.string().optional().default(""),
  }).optional().default({fullName: "", email: "", phone: "", address: ""}),
  recipient: z.object({
    fullName: z.string().optional().default(""),
    email: z.string().email("Invalid email format").optional().default(""),
    phone: z.string().optional().default(""),
    address: z.string().optional().default(""),
  }).optional().default({fullName: "", email: "", phone: "", address: ""}),
  payment: z.object({
    amount: z.coerce.number().optional().default(0),
    isPaid: z.boolean().optional().default(false),
    method: z.string().optional().default("none"),
    isVisible: z.boolean().default(true),
  }).optional().default({amount: 0, isPaid: false, method: "none", isVisible: true}),
  images: z.array(z.string()).optional().default([]),
  pdfs: z.array(z.string()).optional().default([]),
  checkpoints: z.array(z.object({
    id: z.string(),
    location: z.string().optional().default(""),
    description: z.string().optional().default(""),
    timestamp: z.string(),
    status: z.string().optional().default("pending"),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
    customTime: z.boolean().default(false),
    customDate: z.boolean().default(false),
  })).optional().default([]),
  package_type: z.enum(['standard', 'express', 'priority', 'custom']).default('standard'),
  date_shipped: z.string().optional(),
  estimated_delivery_date: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreatePackageForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [pdfs, setPdfs] = useState<string[]>([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tracking_number: "",
      status: "pending",
      description: "",
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
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
        isVisible: true,
      },
      images: [],
      pdfs: [],
      checkpoints: [],
      package_type: "standard",
      date_shipped: "",
      estimated_delivery_date: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createPackage({
        ...values,
        images,
        pdfs,
      })
      if (result.success) {
        toast.success("Package created successfully")
        router.push("/admin/packages")
      } else {
        toast.error("Failed to create package", {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Error creating package:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUrlsChange = (files: string[]) => {
    const validFiles = files.filter(isValidImageUrl)
    setImages(validFiles)
    form.setValue("images", validFiles)
  }

  const handleRandomizeTrackingNumber = async () => {
    const trackingNumber = await generatetracking_number();
    form.setValue("tracking_number", trackingNumber);
  };

  return (
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="p-3 bg-muted/40 rounded-md text-sm mb-4">
              <p className="text-muted-foreground">Only tracking number is required. All other fields are optional and can be filled later.</p>
            </div>
          
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="tracking_number"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tracking Number <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button"
                variant="outline"
                className="mb-1"
                onClick={handleRandomizeTrackingNumber}
              >
                <LucideRefreshCw className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>

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
                      <SelectItem value="package_declared">PACKAGE TO BE DECLARED ⚠️</SelectItem>
                      <SelectItem value="customs_cleared">CUSTOMS CLEARANCE CLEARED</SelectItem>
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Shipped</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              try {
                                const newDate = new Date(date);
                                newDate.setHours(new Date().getHours());
                                newDate.setMinutes(new Date().getMinutes());
                                field.onChange(newDate.toISOString());
                              } catch (e) {
                                console.error("Error parsing date:", e);
                                field.onChange("");
                              }
                            } else {
                              field.onChange("");
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              if (field.value && e.target.value) {
                                const date = new Date(field.value);
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                date.setHours(hours || 0);
                                date.setMinutes(minutes || 0);
                                field.onChange(date.toISOString());
                              }
                            }}
                            defaultValue={field.value ? format(new Date(field.value), "HH:mm") : ""}
                            className="w-full"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimated_delivery_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Estimated Delivery Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              try {
                                const newDate = new Date(date);
                                newDate.setHours(new Date().getHours());
                                newDate.setMinutes(new Date().getMinutes());
                                field.onChange(newDate.toISOString());
                              } catch (e) {
                                console.error("Error parsing date:", e);
                                field.onChange("");
                              }
                            } else {
                              field.onChange("");
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              if (field.value && e.target.value) {
                                const date = new Date(field.value);
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                date.setHours(hours || 0);
                                date.setMinutes(minutes || 0);
                                field.onChange(date.toISOString());
                              }
                            }}
                            defaultValue={field.value ? format(new Date(field.value), "HH:mm") : ""}
                            className="w-full"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
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

          <TabsContent value="tracking" className="space-y-4 pt-4">
            <CheckpointEditor
              tracking_number={form.getValues("tracking_number")}
              initialCheckpoints={[]}
              onCheckpointAdded={() => {
                form.setValue("checkpoints", form.getValues("checkpoints") || [])
              }}
              allowCustomTime={true}
            />
          </TabsContent>

          <TabsContent value="images" className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Package Images</h3>
              <p className="text-sm text-muted-foreground">
                Upload images of the package for documentation and verification purposes. This is optional and can be
                added later.
              </p>

              {images.length > 0 ? (
                <FileUpload onUpload={handleImageUrlsChange} initialFiles={images} maxFiles={5} />
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

              {images.length === 0 && <FileUpload onUpload={handleImageUrlsChange} initialFiles={images} maxFiles={5} />}
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
