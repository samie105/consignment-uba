"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react"
import PackageImageGallery from "@/components/package-image-gallery"
import ShareTrackingDialog from "@/components/share-tracking-dialog"
import ExportPDFButton from "@/components/export-pdf-button"
import dynamic from "next/dynamic"
import { getPackageById } from "@/server/actions/packageActions"

// Dynamically import the map component to avoid SSR issues with Leaflet
const RealPackageMap = dynamic(() => import("@/components/map/real-package-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted/20 flex items-center justify-center rounded-lg">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
        <div className="h-4 w-48 bg-primary/20 rounded mb-2"></div>
        <div className="h-3 w-32 bg-primary/30 rounded"></div>
      </div>
    </div>
  ),
})

export default function PackageTrackingDetails({ tracking_number }: { tracking_number: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [packageData, setPackageData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Helper function to format dimensions
  const formatDimensions = (dimensions: string | { width: number; height: number; length: number }) => {
    if (typeof dimensions === 'string') return dimensions;
    if (typeof dimensions === 'object' && dimensions !== null) {
      const { width, height, length } = dimensions;
      return `${width} × ${height} × ${length} cm`;
    }
    return 'Dimensions not available';
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getPackageById(tracking_number)
        
        if (!result.success || !result.package) {
          setError(result.error || "Package not found. Please check your tracking number and try again.")
          return
        }

        setPackageData(result.package)
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching tracking information. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [tracking_number])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          <div className="h-4 w-48 bg-primary/20 rounded"></div>
          <div className="h-3 w-64 bg-primary/30 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tracking Error</h3>
          <p className="text-muted-foreground text-center">{error}</p>
          <button
            className="mt-6 px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            onClick={() => (window.location.href = "/track")}
          >
            Try Another Tracking Number
          </button>
        </CardContent>
      </Card>
    )
  }

  if (!packageData) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500"
      case "in_transit":
        return "bg-blue-500"
      case "in_warehouse":
        return "bg-gray-500/50"
      case "arrived":
        return "bg-teal-500"
      case "customs_check":
        return "bg-amber-500"
      case "customs_hold":
        return "bg-orange-500"
      case "pending":
        return "bg-yellow-500"
      case "exception":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_warehouse":
        return "In Warehouse"
      case "in_transit":
        return "In Transit"
      case "arrived":
        return "Arrived"
      case "customs_check":
        return "Customs Check"
      case "customs_hold":
        return "Customs Clearance (ON HOLD)"
      case "delivered":
        return "Delivered"
      case "pending":
        return "Pending"
      case "exception":
        return "Exception"
      default:
        return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {/* Status Overview Card */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          },
        }}
      >
        <Card className="mb-8">
          <div className="p-4 border-b">
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const input = form.elements.namedItem("tracking_number") as HTMLInputElement
                if (input && input.value) {
                  window.location.href = `/track?tracking=${encodeURIComponent(input.value)}`
                }
              }}
            >
              <input
                type="text"
                name="tracking_number"
                placeholder="Enter tracking number"
                className="flex-1 px-3 py-2 rounded border border-primary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Track Package
              </button>
            </form>
          </div>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">
                  Tracking Number:{" "}
                  <span className="text-primary bg-primary/10 px-2 py-1 rounded-md ml-2 inline-block">
                    {packageData.tracking_number}
                  </span>
                </CardTitle>
                <CardDescription>
                  {packageData.service} • Shipped on {packageData.shipDate}
                </CardDescription>
              </div>
              <Badge
                className={`text-white px-3 py-1 text-sm capitalize self-start md:self-auto ${getStatusColor(
                  packageData.status,
                )}`}
              >
                {getStatusText(packageData.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">From</h3>
                  <p className="font-medium capitalize">{packageData.sender?.address || "Not specified yet"}</p>
                  <p className="text-sm">{packageData.sender?.fullName || "Not specified yet"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">To</h3>
                  <p className="font-medium">{packageData.recipient?.address || "Not specified yet"}</p>
                  <p className="text-sm">{packageData.recipient?.fullName || "Not specified yet"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {packageData.status === "delivered" ? "Delivered On" : "Estimated Delivery"}
                  </h3>
                  <p className="font-medium">
                    {packageData.created_at ? new Date(packageData.created_at).toLocaleString() : 'Not specified yet'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Weight</h3>
                    <p>{packageData.weight ? `${packageData.weight}KG` : "Not specified yet"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Dimensions</h3>
                    <p>{packageData.dimensions ? formatDimensions(packageData.dimensions) : "Not specified yet"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Package Type</h3>
                    <p>{packageData.packageType || "Not specified yet"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <ShareTrackingDialog tracking_number={packageData.tracking_number} />
              <ExportPDFButton packageData={packageData} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Tracking Information */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.3 },
          },
        }}
      >
        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="w-full bg-primary/10">
            <TabsTrigger
              value="tracking"
              className="text-[10px] w-full sm:text-sm md:text-base data-[state=active]:bg-primary/30"
            >
              Tracking History
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="text-[10px] w-full sm:text-sm md:text-base data-[state=active]:bg-primary/30"
            >
              Live Map
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="text-[10px] sm:text-sm w-full md:text-base data-[state=active]:bg-primary/30"
            >
              Package Details
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="text-[10px] sm:text-sm w-full md:text-base data-[state=active]:bg-primary/30"
            >
              Package Images
            </TabsTrigger>
          </TabsList>

          {/* Tracking History Tab */}
          <TabsContent value="tracking">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                  <CardDescription>Follow your package's journey from origin to destination</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline line */}
                  

                    {/* Checkpoints */}
                    <div className="space-y-8">
                      {packageData.checkpoints?.map((checkpoint: any, index: number) => (
                        <motion.div
                          key={checkpoint.id}
                          className="relative pl-10"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: "easeOut",
                          }}
                        >
                       
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 overflow-visible top-1.5 h-6 w-6 rounded-full border-2 border-background flex items-center justify-center z-20 ${
                              index === 0
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted-foreground/20 text-muted-foreground"
                            }`}
                          >    
                         {index < packageData.checkpoints.length - 1 &&    <div
                          className=" absolute top-9 md:top-8 w-0 border z-50 h-40 md:h-28 border-primary/50 border-dashed"
                       
                        />}
                            {index === 0 && <CheckCircle className="h-4 w-4" />}
                            {index > 0 && <div className="h-2 bg-primary animate-ping w-2 rounded-full" />}

                          </div>


                          {/* Checkpoint content */}
                          <div
                            className={`space-y-2 p-4 rounded-lg border transition-all ${
                              index === 0
                                ? "bg-background border-primary/20 shadow-sm"
                                : "bg-muted/30 border-muted hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                              <h3 className={index === 0 ? "font-semibold text-primary" : "font-semibold"}>
                              {checkpoint.description}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1 inline" />
                                {new Date(checkpoint.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              <p className="text-sm">{checkpoint.location}</p>
                            </div>
                            <p className={`text-sm  inline-flex text-white py-1 px-2 rounded-full ${getStatusColor(checkpoint.status)}`}> {getStatusText(checkpoint.status)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Live Map Tab */}
          <TabsContent value="map">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Live Package Location</CardTitle>
                  <CardDescription>See where your package is currently located</CardDescription>
                </CardHeader>
                <CardContent>
                  <RealPackageMap packageData={packageData} height="400px" />
                  <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                    <h3 className="font-medium mb-2">Current Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {packageData.current_location?.address || "Location information not available"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Package Details Tab */}
          <TabsContent value="details">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                  <CardDescription>Comprehensive information about your shipment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Shipment Information</h3>
                        <dl className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Tracking Number:</dt>
                            <dd>{packageData.tracking_number}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Service Type:</dt>
                            <dd>{packageData.service}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Ship Date:</dt>
                            <dd>{packageData.shipDate}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">
                              {packageData.status === "delivered" ? "Delivery Date:" : "Estimated Delivery:"}
                            </dt>
                            <dd>
                              {packageData.status === "delivered"
                                ? packageData.actualDelivery
                                : packageData.estimatedDelivery}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Package Information</h3>
                        <dl className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Package Type:</dt>
                            <dd>{packageData.packageType}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Weight:</dt>
                            <dd>{packageData.weight}KG</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Dimensions:</dt>
                            <dd>{formatDimensions(packageData.dimensions)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Sender Information</h3>
                        <dl className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Name:</dt>
                            <dd>{packageData.sender.fullName}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Location:</dt>
                            <dd>{packageData.sender.address}</dd>
                          </div>
                        </dl>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Recipient Information</h3>
                        <dl className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Name:</dt>
                            <dd>{packageData.recipient.fullName}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="text-sm font-medium text-muted-foreground sm:w-40">Location:</dt>
                            <dd>{packageData.recipient.address}</dd>
                          </div>
                        </dl>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Current Location</h3>
                        <p className="text-sm">
                          {packageData.current_location?.address || "Location information not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Package Images Tab */}
          <TabsContent value="images">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Package Images</CardTitle>
                  <CardDescription>Visual documentation of your package throughout its journey</CardDescription>
                </CardHeader>
                <CardContent>
                  {packageData.images && packageData.images.length > 0 ? (
                    <PackageImageGallery images={packageData.images} />
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Images Available</h3>
                      <p className="text-sm text-muted-foreground">
                        There are no images available for this package yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
