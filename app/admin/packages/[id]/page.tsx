import { getPackageById } from "@/server/actions/packageActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Printer, Edit, MapPin } from "lucide-react"
import Link from "next/link"
import { PackageImageGallery } from "@/components/package-image-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DeletePackageButton from "@/components/admin/delete-package-button"
import { DynamicLocationPicker, DynamicRealPackageMap } from "@/components/client/dynamic-imports"

const statusColors = {
  pending: "bg-yellow-500",
  in_warehouse: "bg-purple-500",
  in_transit: "bg-blue-500",
  arrived: "bg-teal-500",
  customs_check: "bg-amber-500",
  customs_hold: "bg-orange-500",
  delivered: "bg-green-500",
  exception: "bg-red-500",
}

const statusText = {
  pending: "Pending",
  in_warehouse: "In Warehouse",
  in_transit: "In Transit",
  arrived: "Arrived",
  customs_check: "Customs Check",
  customs_hold: "Customs Clearance (ON HOLD)",
  delivered: "Delivered",
  exception: "Exception",
}

export default async function PackageDetailsPage({ params }: { params: { id: string } }) {
  const { package: packageData, success } = await getPackageById( params.id)

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

  const getStatusDisplay = (status: string) => {
    return statusText[status as keyof typeof statusText] || status.replace("_", " ").toUpperCase()
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
            <Link href={`/admin/packages/${packageData.tracking_number}/print`}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/packages/${packageData.tracking_number}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DeletePackageButton tracking_number={packageData.tracking_number} />
        </div>
      </div>

      {/* Rest of the component remains the same */}

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
                {/* Current location map - using client component wrapper */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Current Location</h3>
                  <DynamicRealPackageMap
                    packageData={{
                      tracking_number: packageData.tracking_number,
                      status: packageData.status,
                      statusText: getStatusDisplay(packageData.status),
                      current_location: packageData.current_location,
                    }}
                    checkpoints={packageData.checkpoints}
                    showCheckpoints={true}
                  />
                </div>

                {/* Location picker - using client component wrapper */}
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-lg font-medium">Update Package Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on the map to set a new location for this package
                  </p>
                  <DynamicLocationPicker
                    tracking_number={packageData.tracking_number}
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
            <div className="space-y-4">
              {timelineItems.map((item:any, index:any) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium text-white rounded ${getStatusColor(
                  item.status
                  )}`}
                >
                  {getStatusDisplay(item.status)}
                </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{item.date}</p>
              </Card>
              ))}
            </div>
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
