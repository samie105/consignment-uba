"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
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
import { v4 as uuidv4 } from "uuid"

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
  const [checkpointVersion, setCheckpointVersion] = useState(0)
  
  console.log("EditPackageForm rendered with packageData:", packageData);
  console.log("Checkpoints from packageData:", packageData.checkpoints);

  const form = useForm({
    defaultValues: {
      tracking_number: packageData.tracking_number,
      status: packageData.status,
      description: packageData.description,
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      sender: packageData.sender,
      recipient: packageData.recipient,
      payment: {
        ...packageData.payment,
        isVisible: packageData.payment.isVisible ?? true,
        currency: packageData.payment.currency ?? "USD",
      },
      images: packageData.images || [],
      pdfs: packageData.pdfs || [],
      checkpoints: (packageData.checkpoints || []).map(checkpoint => {
        console.log("Processing checkpoint for form:", checkpoint);
        return {
          ...checkpoint,
          customTime: false,
          customDate: false,
          timestamp: checkpoint.timestamp || new Date().toISOString(),
        };
      }),
      package_type: packageData.package_type || 'standard',
      date_shipped: packageData.date_shipped || null,
      estimated_delivery_date: packageData.estimated_delivery_date || null,
    },
  })
  
  useEffect(() => {
    console.log("Form values after initialization:", form.getValues());
    console.log("Checkpoints in form:", form.getValues("checkpoints"));
  }, []);

  return (
    <>
      <Tabs defaultValue="details" className="w-full" onValueChange={(value) => {
        console.log("Tab changed to:", value);
        console.log("Current form checkpoints:", form.getValues("checkpoints"));
      }}>
        <TabsList className="grid w-full grid-cols-4">
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
        </TabsList>

        <Form {...form}>
          <form className="space-y-6">
            <TabsContent value="details" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="tracking_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <FormLabel>Amount</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name="payment.currency"
                          render={({ field: currencyField }) => (
                            <FormItem className="w-32 flex-shrink-0">
                              <Select onValueChange={currencyField.onChange} defaultValue={currencyField.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD ($)</SelectItem>
                                  <SelectItem value="EUR">EUR (€)</SelectItem>
                                  <SelectItem value="GBP">GBP (£)</SelectItem>
                                  <SelectItem value="BTC">Bitcoin (₿)</SelectItem>
                                  <SelectItem value="ETH">Ethereum (Ξ)</SelectItem>
                                  <SelectItem value="USDT">Tether (₮)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
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
                            <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                            <SelectItem value="Ethereum">Ethereum</SelectItem>
                            <SelectItem value="USDT">USDT</SelectItem>
                            <SelectItem value="Other Crypto">Other Cryptocurrency</SelectItem>
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
                                  field.onChange(null);
                                }
                              } else {
                                field.onChange(null);
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
                                  field.onChange(null);
                                }
                              } else {
                                field.onChange(null);
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
                        <Input type="text" {...field} />
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
                        <Input type="text" {...field} />
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
              {/* Debug info */}
              {(() => {
                console.log("Tracking tab loaded. Raw checkpoints from packageData:", packageData.checkpoints);
                return null;
              })()}
              <CheckpointEditor
                key={`tracking-editor-${packageData.tracking_number}-${checkpointVersion}-${form.getValues("checkpoints").map(cp => cp.id).join("-")}`}
                tracking_number={packageData.tracking_number || "edit-preview"}
                initialCheckpoints={(form.getValues("checkpoints") || []).map(checkpoint => {
                  console.log("Processing checkpoint:", checkpoint);
                  return {
                    ...checkpoint,
                    coordinates: checkpoint.coordinates ? {
                      lat: checkpoint.coordinates.latitude,
                      lng: checkpoint.coordinates.longitude
                    } : null,
                    // Ensure all required fields have values
                    location: checkpoint.location || "",
                    description: checkpoint.description || "",
                    status: checkpoint.status || "in_transit",
                    timestamp: checkpoint.timestamp || new Date().toISOString(),
                    id: checkpoint.id || `edit-temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    customTime: false,
                    customDate: false,
                  }
                })}
                onCheckpointAdded={(updatedCheckpoints) => {
                  if (updatedCheckpoints) {
                    console.log("Parent receiving updated checkpoints:", updatedCheckpoints);
                    
                    // Create a forceful update by replacing the entire checkpoints array
                    try {
                      const formattedCheckpoints = updatedCheckpoints.map(cp => ({
                        ...cp,
                        coordinates: cp.coordinates ? {
                          latitude: (cp.coordinates.lat !== undefined ? cp.coordinates.lat : 
                                    cp.coordinates.latitude !== undefined ? cp.coordinates.latitude : 0),
                          longitude: (cp.coordinates.lng !== undefined ? cp.coordinates.lng :
                                     cp.coordinates.longitude !== undefined ? cp.coordinates.longitude : 0)
                        } : null,
                        id: cp.id,
                        location: cp.location || "",
                        description: cp.description || "",
                        status: cp.status || "in_transit",
                        timestamp: cp.timestamp || new Date().toISOString()
                      }));
                      
                      // Update packageData directly to ensure data consistency
                      packageData.checkpoints = formattedCheckpoints;
                      
                      // Set the form value with all validation flags to force update
                      form.setValue("checkpoints", formattedCheckpoints, { 
                        shouldDirty: true, 
                        shouldTouch: true,
                        shouldValidate: true 
                      });
                      
                      // Force re-render with a version update
                      setCheckpointVersion(prev => prev + 1);
                      
                      console.log("Form values after checkpoint update:", form.getValues("checkpoints"));
                    } catch (error) {
                      console.error("Error updating checkpoints in form:", error);
                    }
                  }
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
                onClick={async (e) => {
                  e.preventDefault();
                  
                  try {
                    setIsSubmitting(true);
                    
                    const formValues = form.getValues();
                    const originalTrackingNumber = packageData.tracking_number;
                    
                    const cleanedFormValues = {
                      ...formValues,
                      date_shipped: formValues.date_shipped && formValues.date_shipped !== "" 
                        ? formValues.date_shipped 
                        : null,
                      estimated_delivery_date: formValues.estimated_delivery_date && formValues.estimated_delivery_date !== "" 
                        ? formValues.estimated_delivery_date 
                        : null,
                      sender: {
                        ...formValues.sender,
                        email: formValues.sender?.email || '',
                      },
                      recipient: {
                        ...formValues.recipient,
                        email: formValues.recipient?.email || '',
                      },
                      checkpoints: (formValues.checkpoints || []).map(checkpoint => {
                        let timestamp;
                        try {
                          timestamp = checkpoint.timestamp && checkpoint.timestamp !== "" 
                            ? new Date(checkpoint.timestamp).toISOString()
                            : new Date().toISOString();
                        } catch (e) {
                          timestamp = new Date().toISOString();
                        }
                        
                        let coordinates = null;
                        if (checkpoint.coordinates) {
                          const coords = checkpoint.coordinates as any;
                          coordinates = {
                            latitude: coords.lat !== undefined ? coords.lat : coords.latitude,
                            longitude: coords.lng !== undefined ? coords.lng : coords.longitude
                          };
                        }
                        
                        return {
                          id: checkpoint.id || uuidv4(),
                          timestamp,
                          location: checkpoint.location || '',
                          description: checkpoint.description || '',
                          status: checkpoint.status || 'in_transit',
                          coordinates
                        };
                      }),
                      admin_id: packageData.admin_id,
                    };
                    
                    const dataToSave = {
                      ...cleanedFormValues,
                      images,
                      pdfs,
                    };
                    
                    try {
                      const updateResult = await updatePackage(originalTrackingNumber, dataToSave);
                      
                      if (updateResult.success) {
                        toast.success("Package updated successfully");
                        router.push('/admin/packages');
                        router.refresh();
                        onSuccess();
                      } else {
                        if (updateResult.error?.includes('timestamp') || updateResult.error?.includes('22007')) {
                          toast.error("Date/time format error", {
                            description: "There was an issue with the date formats. Please try again."
                          });
                        } else {
                          toast.error("Failed to update package", {
                            description: updateResult.error || "Unknown error",
                          });
                        }
                      }
                    } catch (saveError) {
                      console.error("Exception during package update:", saveError);
                      toast.error("Unable to save package", {
                        description: "An error occurred while saving. Please try again."
                      });
                    }
                  } catch (error) {
                    console.error("Error updating package:", error);
                    
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    if (errorMessage.includes('timestamp') || errorMessage.includes('22007')) {
                      toast.error("Date/time format error", {
                        description: "Please ensure all dates are valid or leave them blank"
                      });
                    } else {
                      toast.error("An unexpected error occurred");
                    }
                    
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
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
