"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

export default function ShippingForm() {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    senderAddress: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientAddress: "",
    packageType: "",
    weight: "",
    dimensions: "",
    serviceType: "standard",
    specialInstructions: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, serviceType: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the form data to an API
    console.log("Form submitted:", formData)
    toast({
      title: "Shipping request submitted",
      description: "We'll process your request and contact you shortly.",
    })
    // Reset form or redirect
  }

  return (
    <section id="shipping" className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ship a Package</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Fill out the form below to get started with your shipment
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl py-12">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
              <CardDescription>Provide the necessary information to process your shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="sender" className="w-full space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="sender"
                      className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-2 whitespace-normal h-auto"
                    >
                      Sender Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="recipient"
                      className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-2 whitespace-normal h-auto"
                    >
                      Recipient Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="package"
                      className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-2 whitespace-normal h-auto"
                    >
                      Package Details
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="sender" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="senderName">Full Name</Label>
                        <Input
                          id="senderName"
                          name="senderName"
                          value={formData.senderName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senderEmail">Email</Label>
                        <Input
                          id="senderEmail"
                          name="senderEmail"
                          type="email"
                          value={formData.senderEmail}
                          onChange={handleChange}
                          placeholder="john.doe@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="senderPhone">Phone Number</Label>
                        <Input
                          id="senderPhone"
                          name="senderPhone"
                          value={formData.senderPhone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderAddress">Address</Label>
                      <Textarea
                        id="senderAddress"
                        name="senderAddress"
                        value={formData.senderAddress}
                        onChange={handleChange}
                        placeholder="Enter your full address"
                        required
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="recipient" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Full Name</Label>
                        <Input
                          id="recipientName"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleChange}
                          placeholder="Jane Smith"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail">Email</Label>
                        <Input
                          id="recipientEmail"
                          name="recipientEmail"
                          type="email"
                          value={formData.recipientEmail}
                          onChange={handleChange}
                          placeholder="jane.smith@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="recipientPhone">Phone Number</Label>
                        <Input
                          id="recipientPhone"
                          name="recipientPhone"
                          value={formData.recipientPhone}
                          onChange={handleChange}
                          placeholder="+1 (555) 987-6543"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientAddress">Address</Label>
                      <Textarea
                        id="recipientAddress"
                        name="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={handleChange}
                        placeholder="Enter recipient's full address"
                        required
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="package" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="packageType">Package Type</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("packageType", value)}
                          defaultValue={formData.packageType}
                        >
                          <SelectTrigger id="packageType">
                            <SelectValue placeholder="Select package type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="parcel">Parcel</SelectItem>
                            <SelectItem value="fragile">Fragile</SelectItem>
                            <SelectItem value="heavy">Heavy Goods</SelectItem>
                            <SelectItem value="perishable">Perishable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={formData.weight}
                          onChange={handleChange}
                          placeholder="0.5"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions (L x W x H in cm)</Label>
                      <Input
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        placeholder="30 x 20 x 10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <RadioGroup
                        defaultValue={formData.serviceType}
                        onValueChange={handleRadioChange}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard">Standard Delivery (3-5 business days)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express">Express Delivery (1-2 business days)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="same-day" id="same-day" />
                          <Label htmlFor="same-day">Same Day Delivery (where available)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleChange}
                        placeholder="Any special handling instructions or delivery notes"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit Shipping Request
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">
                By submitting this form, you agree to our shipping terms and conditions. Pricing will be calculated
                based on weight, dimensions, and service type.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
