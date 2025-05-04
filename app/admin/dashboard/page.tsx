import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllPackages } from "@/server/actions/packageActions"
import { PackageTable } from "@/components/admin/package-table"

export default async function AdminDashboard() {
  const { success, packages, error } = await getAllPackages()

  // Calculate statistics
  const totalPackages = packages?.length || 0
  const pendingPackages = packages?.filter((pkg) => pkg.status === "pending").length || 0
  const inTransitPackages = packages?.filter((pkg) => pkg.status === "in_transit").length || 0
  const deliveredPackages = packages?.filter((pkg) => pkg.status === "delivered").length || 0

  const recentPackages = packages || []

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/admin/packages/create">
          <Button>Create Package</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitPackages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPackages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredPackages}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Packages */}
      <Card className="col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Packages</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/packages">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {success ? (
            <PackageTable packages={recentPackages.slice(0, 5)} simplified={true} />
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No packages available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
