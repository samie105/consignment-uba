"use client"
import { getPackageById } from "@/server/actions/packageActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Printer, Edit, MapPin } from "lucide-react"
import Link from "next/link"
import { Timeline } from "@/components/custom/timeline"
import { Badge } from "@/components/ui/badge"
import { PackageImageGallery } from "@/components/package-image-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Dynamically import the location picker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("@/components/admin/location-picker"), { ssr: false })

// Dynamically import the map component to avoid SSR issues with Leaflet
const PackageLocationMap = dynamic(() => import("@/components/map/package-location-map"), { ssr: false })

const statusColors = {
  pending: "bg-yellow-500",
  in_transit: "bg-blue-500",
  delivered: "bg-green-500",
  exception: "bg-red-500",
}

export default async function PackageDetailsPage({ params }: { params: { id: string } }) {
  const { package: packageData, success } = await getPackageById(params.id)

  if (!success || !packageData) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Package Not Found</h1>
        </div>
        <p>The requested package could not be found.</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500"
  }

  const timelineItems = packageData.checkpoints.map((checkpoint: any) => ({
    title: checkpoint.location,
    description: checkpoint.description,
    date: new Date(checkpoint.timestamp).toLocaleString(),
    status: checkpoint.status,
  }))

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/packages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Package Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/packages/${packageData.trackingNumber}/print`}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/packages/${packageData.trackingNumber}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Package Information</CardTitle>
              <Badge className={getStatusColor(packageData.status)}>
                {packageData.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <CardDescription>Tracking Number: {packageData.trackingNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{packageData.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Weight</h3>
                  <p>{packageData.weight} kg</p>
                </div>
                <div>
                  <h3 className="font-medium">Dimensions</h3>
                  <p>
                    {packageData.dimensions.length} × {packageData.dimensions.width} × {packageData.dimensions.height}{" "}
                    cm
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Payment</h3>
                <p>
                  Amount: ${packageData.payment.amount} - {packageData.payment.isPaid ? "Paid" : "Unpaid"}
                  {packageData.payment.method && ` (${packageData.payment.method})`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Shipping Details</CardTitle>
            <CardDescription>Sender and recipient information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium">Sender</h3>
                <p className="text-sm">{packageData.sender.fullName}</p>
                <p className="text-sm">{packageData.sender.email}</p>
                <p className="text-sm">{packageData.sender.phone}</p>
                <p className="text-sm">{packageData.sender.address}</p>
              </div>
              <div>
                <h3 className="font-medium">Recipient</h3>
                <p className="text-sm">{packageData.recipient.fullName}</p>
                <p className="text-sm">{packageData.recipient.email}</p>
                <p className="text-sm">{packageData.recipient.phone}</p>
                <p className="text-sm">{packageData.recipient.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracking">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracking">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Tracking & Location
            </span>
          </TabsTrigger>
          <TabsTrigger value="history">Timeline History</TabsTrigger>
          <TabsTrigger value="images">Package Images</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Package Location</CardTitle>
              <CardDescription>Current location of the package</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current location map */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Current Location</h3>
                  <PackageLocationMap packageData={packageData} checkpoints={packageData.checkpoints} />
                </div>

                {/* Location picker */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-lg font-medium">Update Package Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on the map to set a new location for this package
                  </p>
                  <LocationPicker
                    trackingNumber={packageData.trackingNumber}
                    initialLocation={packageData.current_location}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>Timeline of the package's journey</CardDescription>
            </CardHeader>
            <CardContent>
              {timelineItems.length > 0 ? (
                <Timeline items={timelineItems} />
              ) : (
                <div className="text-center p-6">
                  <p>No tracking history available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Package Images</CardTitle>
              <CardDescription>Images of the package</CardDescription>
            </CardHeader>
            <CardContent>
              {packageData.images && packageData.images.length > 0 ? (
                <PackageImageGallery images={packageData.images} />
              ) : (
                <div className="text-center p-6">
                  <p>No images available for this package yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
